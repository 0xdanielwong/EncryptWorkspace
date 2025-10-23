import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { Contract } from 'ethers';

import { Header } from './Header';
import { COMPANY_WORKSPACE_ABI } from '../config/abi';
import { COMPANY_WORKSPACE_ADDRESS } from '../config/contracts';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { useZamaInstance } from '../hooks/useZamaInstance';
import type { CompanyRecord, DocumentRecord } from '../type/company';
import {
  decryptWithCompanyPassword,
  encryptWithCompanyPassword,
  generatePasswordAddress,
} from '../utils/encryption';
import { formatTimestamp } from '../utils/format';
import '../styles/WorkspaceApp.css';

const CONTRACT_ADDRESS = COMPANY_WORKSPACE_ADDRESS;
const CONTRACT_ABI = COMPANY_WORKSPACE_ABI;

export function WorkspaceApp() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient({ chainId: sepolia.id });
  const { data: walletClient } = useWalletClient();
  const signerPromise = useEthersSigner();
  const { instance, isLoading: zamaLoading, error: zamaError } = useZamaInstance();

  const [companies, setCompanies] = useState<CompanyRecord[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [decryptedDocuments, setDecryptedDocuments] = useState<Record<number, { title: string; body: string }>>({});
  const [decryptedPassword, setDecryptedPassword] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentBody, setDocumentBody] = useState('');

  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [creatingCompany, setCreatingCompany] = useState(false);
  const [joiningCompany, setJoiningCompany] = useState(false);
  const [postingDocument, setPostingDocument] = useState(false);
  const [decryptingPassword, setDecryptingPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const activeCompany = useMemo(
    () => companies.find(company => company.id === selectedCompanyId) ?? null,
    [companies, selectedCompanyId]
  );

  const loadCompanies = useCallback(async () => {
    if (!publicClient) {
      return;
    }

    setLoadingCompanies(true);
    try {
      const count = (await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getCompanyCount',
      })) as bigint;

      const total = Number(count);
      const results: CompanyRecord[] = [];

      for (let id = 1; id <= total; id += 1) {
        const response = (await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'getCompany',
          args: [BigInt(id)],
        })) as [string, string, `0x${string}`, bigint, bigint, bigint];

        const [name, owner, cipher, createdAt, memberCount, documentCount] = response;

        results.push({
          id,
          name,
          owner,
          passwordCipher: cipher,
          createdAt: Number(createdAt),
          memberCount: Number(memberCount),
          documentCount: Number(documentCount),
        });
      }

      setCompanies(results);

      if (selectedCompanyId && !results.some(company => company.id === selectedCompanyId)) {
        setSelectedCompanyId(null);
      }
    } catch (error) {
      console.error('Failed to load companies', error);
      setActionError('Unable to load companies. Please retry later.');
    } finally {
      setLoadingCompanies(false);
    }
  }, [publicClient, selectedCompanyId]);

  const loadDocuments = useCallback(
    async (companyId: number, password: string | null) => {
      if (!publicClient) {
        return;
      }

      setLoadingDocuments(true);
      try {
        const response = (await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'getDocuments',
          args: [BigInt(companyId)],
        })) as Array<{ encryptedTitle: string; encryptedBody: string; author: string; createdAt: bigint }>;

        const parsed: DocumentRecord[] = response.map((doc, index) => ({
          id: index,
          encryptedTitle: doc.encryptedTitle,
          encryptedBody: doc.encryptedBody,
          author: doc.author,
          createdAt: Number(doc.createdAt),
        }));

        setDocuments(parsed);

        if (password) {
          const decrypted: Record<number, { title: string; body: string }> = {};
          for (const doc of parsed) {
            try {
              const title = await decryptWithCompanyPassword(password, doc.encryptedTitle);
              const body = await decryptWithCompanyPassword(password, doc.encryptedBody);
              decrypted[doc.id] = { title, body };
            } catch (error) {
              console.error('Failed to decrypt document', error);
            }
          }
          setDecryptedDocuments(decrypted);
        } else {
          setDecryptedDocuments({});
        }
      } catch (error) {
        console.error('Failed to load documents', error);
        setActionError('Unable to load company documents.');
      } finally {
        setLoadingDocuments(false);
      }
    },
    [publicClient]
  );

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  useEffect(() => {
    if (selectedCompanyId) {
      loadDocuments(selectedCompanyId, decryptedPassword);
    } else {
      setDocuments([]);
      setDecryptedDocuments({});
    }
  }, [selectedCompanyId, decryptedPassword, loadDocuments]);

  const handleCreateCompany = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setActionError(null);
      setStatusMessage(null);

      if (!isConnected || !address) {
        setActionError('Connect your wallet before creating a company.');
        return;
      }

      if (!companyName.trim()) {
        setActionError('Company name cannot be empty.');
        return;
      }

      if (!instance) {
        setActionError('Encryption service is not ready yet.');
        return;
      }

      const signer = await signerPromise;
      if (!signer) {
        setActionError('Unable to access signer.');
        return;
      }

      try {
        setCreatingCompany(true);
        setGeneratedPassword(null);

        const passwordAddress = generatePasswordAddress();
        const encryptedInput = await instance
          .createEncryptedInput(CONTRACT_ADDRESS, address)
          .addAddress(passwordAddress)
          .encrypt();

        const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        const tx = await contract.createCompany(
          companyName.trim(),
          encryptedInput.handles[0],
          encryptedInput.inputProof
        );

        setStatusMessage('Waiting for confirmation...');
        await tx.wait();

        setCompanyName('');
        setGeneratedPassword(passwordAddress);
        setStatusMessage('Company created successfully. Keep the password safe.');

        await loadCompanies();

        const totalCompanies = await contract.getCompanyCount();
        setSelectedCompanyId(Number(totalCompanies));
      } catch (error) {
        console.error('Failed to create company', error);
        setActionError('Failed to create company. Please try again.');
      } finally {
        setCreatingCompany(false);
      }
    },
    [address, companyName, instance, isConnected, loadCompanies, signerPromise]
  );

  const handleJoinCompany = useCallback(
    async (companyId: number) => {
      setActionError(null);
      setStatusMessage(null);

      if (!isConnected || !address) {
        setActionError('Connect your wallet to join a company.');
        return;
      }

      const signer = await signerPromise;
      if (!signer) {
        setActionError('Unable to access signer.');
        return;
      }

      try {
        setJoiningCompany(true);
        const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        const tx = await contract.joinCompany(companyId);
        setStatusMessage('Waiting for confirmation...');
        await tx.wait();

        setStatusMessage('Joined company successfully.');
        await loadCompanies();
        setSelectedCompanyId(companyId);
      } catch (error) {
        console.error('Failed to join company', error);
        setActionError('Failed to join the company. Please try again.');
      } finally {
        setJoiningCompany(false);
      }
    },
    [address, isConnected, loadCompanies, signerPromise]
  );

  const handleDecryptPassword = useCallback(
    async (company: CompanyRecord) => {
      if (!instance) {
        setActionError('Encryption service is not ready yet.');
        return;
      }

      if (!walletClient || !address) {
        setActionError('Connect your wallet to decrypt the password.');
        return;
      }

      setDecryptingPassword(true);
      setActionError(null);

      try {
        const { publicKey, privateKey } = instance.generateKeypair();
        const startTimestamp = Math.floor(Date.now() / 1000);
        const durationDays = 1;
        const contractAddresses = [CONTRACT_ADDRESS];

        const typedData = instance.createEIP712(publicKey, contractAddresses, startTimestamp, durationDays);
        const { EIP712Domain, ...types } = typedData.types;

        const signature = await walletClient.signTypedData({
          account: walletClient.account.address,
          domain: typedData.domain,
          message: typedData.message,
          primaryType: typedData.primaryType as 'UserDecrypt',
          types,
        });

        const result = await instance.userDecrypt(
          [
            {
              handle: company.passwordCipher,
              contractAddress: CONTRACT_ADDRESS,
            },
          ],
          privateKey,
          publicKey,
          signature,
          contractAddresses,
          address,
          startTimestamp,
          durationDays
        );

        const decrypted = result[company.passwordCipher];
        if (typeof decrypted !== 'string') {
          throw new Error('Unexpected decryption result');
        }

        setDecryptedPassword(decrypted);
        setStatusMessage('Company password decrypted. Documents unlocked.');

        await loadDocuments(company.id, decrypted);
      } catch (error) {
        console.error('Failed to decrypt password', error);
        setActionError('Unable to decrypt the company password. Make sure you are a member.');
      } finally {
        setDecryptingPassword(false);
      }
    },
    [address, instance, loadDocuments, walletClient]
  );

  const handlePostDocument = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setActionError(null);
      setStatusMessage(null);

      if (!activeCompany) {
        setActionError('Select a company first.');
        return;
      }

      if (!decryptedPassword) {
        setActionError('Decrypt the company password before posting documents.');
        return;
      }

      if (!documentTitle.trim() || !documentBody.trim()) {
        setActionError('Document title and body cannot be empty.');
        return;
      }

      const signer = await signerPromise;
      if (!signer) {
        setActionError('Unable to access signer.');
        return;
      }

      try {
        setPostingDocument(true);
        const encryptedTitle = await encryptWithCompanyPassword(decryptedPassword, documentTitle.trim());
        const encryptedBody = await encryptWithCompanyPassword(decryptedPassword, documentBody.trim());

        const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        const tx = await contract.postDocument(activeCompany.id, encryptedTitle, encryptedBody);

        setStatusMessage('Waiting for transaction confirmation...');
        await tx.wait();

        setDocumentTitle('');
        setDocumentBody('');
        setStatusMessage('Document published to the company workspace.');

        await loadDocuments(activeCompany.id, decryptedPassword);
        await loadCompanies();
      } catch (error) {
        console.error('Failed to publish document', error);
        setActionError('Failed to publish the document. Please try again.');
      } finally {
        setPostingDocument(false);
      }
    },
    [activeCompany, decryptedPassword, documentBody, documentTitle, loadCompanies, loadDocuments, signerPromise]
  );

  return (
    <div className="workspace-app">
      <Header />

      <main className="workspace-main">
        <section className="workspace-grid">
          <div className="panel">
            <h2>Create a Company</h2>
            <p className="panel-description">
              Deploy a new collaborative space. A random password address is generated and fully homomorphically encrypted on-chain.
            </p>
            <form onSubmit={handleCreateCompany} className="form">
              <label className="form-label" htmlFor="company-name">
                Company name
              </label>
              <input
                id="company-name"
                className="form-input"
                placeholder="Enter company name"
                value={companyName}
                onChange={event => setCompanyName(event.target.value)}
              />
              <button className="primary-button" type="submit" disabled={creatingCompany || zamaLoading}>
                {creatingCompany ? 'Creating...' : 'Create company'}
              </button>
              {generatedPassword && (
                <div className="password-banner">
                  <strong>Company password address:</strong>
                  <span>{generatedPassword}</span>
                  <p>Share it securely with teammates. It is required to encrypt and decrypt documents.</p>
                </div>
              )}
            </form>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2>Companies</h2>
              <button
                className="secondary-button"
                type="button"
                onClick={loadCompanies}
                disabled={loadingCompanies}
              >
                {loadingCompanies ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            {companies.length === 0 ? (
              <p className="empty-state">No companies yet. Create the first one.</p>
            ) : (
              <ul className="company-list">
                {companies.map(company => {
                  const isSelected = selectedCompanyId === company.id;
                  const isOwner = company.owner.toLowerCase() === (address ?? '').toLowerCase();
                  return (
                    <li key={company.id} className={`company-item ${isSelected ? 'selected' : ''}`}>
                      <button
                        type="button"
                        className="company-select"
                        onClick={() => setSelectedCompanyId(company.id)}
                      >
                        <div>
                          <h3>{company.name}</h3>
                          <p>Owner: {company.owner}</p>
                          <p>
                            Members: {company.memberCount} · Documents: {company.documentCount}
                          </p>
                        </div>
                        <span className="company-id">#{company.id}</span>
                      </button>
                      {!isOwner && (
                        <button
                          type="button"
                          className="join-button"
                          onClick={() => handleJoinCompany(company.id)}
                          disabled={joiningCompany}
                        >
                          {joiningCompany ? 'Joining...' : 'Join'}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Workspace</h2>
            {activeCompany && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => handleDecryptPassword(activeCompany)}
                disabled={decryptingPassword}
              >
                {decryptingPassword ? 'Decrypting...' : 'Decrypt company password'}
              </button>
            )}
          </div>

          {!activeCompany && <p className="empty-state">Select a company to view its activity.</p>}

          {activeCompany && (
            <div className="workspace-details">
              <div className="company-details">
                <div className="detail-item">
                  <span>Owner</span>
                  <strong>{activeCompany.owner}</strong>
                </div>
                <div className="detail-item">
                  <span>Created</span>
                  <strong>{formatTimestamp(activeCompany.createdAt)}</strong>
                </div>
                <div className="detail-item">
                  <span>Members</span>
                  <strong>{activeCompany.memberCount}</strong>
                </div>
                <div className="detail-item">
                  <span>Documents</span>
                  <strong>{activeCompany.documentCount}</strong>
                </div>
              </div>

              <div className="document-section">
                <h3>Publish encrypted document</h3>
                <form onSubmit={handlePostDocument} className="form">
                  <label className="form-label" htmlFor="document-title">
                    Document title
                  </label>
                  <input
                    id="document-title"
                    className="form-input"
                    placeholder="Confidential roadmap"
                    value={documentTitle}
                    onChange={event => setDocumentTitle(event.target.value)}
                    disabled={!decryptedPassword}
                  />

                  <label className="form-label" htmlFor="document-body">
                    Document content
                  </label>
                  <textarea
                    id="document-body"
                    className="form-textarea"
                    placeholder="Only members with the company password can read this."
                    value={documentBody}
                    onChange={event => setDocumentBody(event.target.value)}
                    disabled={!decryptedPassword}
                    rows={6}
                  />

                  <button
                    className="primary-button"
                    type="submit"
                    disabled={postingDocument || !decryptedPassword}
                  >
                    {postingDocument ? 'Publishing...' : 'Publish document'}
                  </button>
                </form>
              </div>

              <div className="document-list">
                <div className="panel-header">
                  <h3>Documents</h3>
                  {loadingDocuments && <span className="loading-tag">Loading...</span>}
                </div>
                {documents.length === 0 ? (
                  <p className="empty-state">No documents published yet.</p>
                ) : (
                  <ul>
                    {documents.map(doc => {
                      const decrypted = decryptedDocuments[doc.id];
                      return (
                        <li key={`${doc.id}-${doc.author}`} className="document-item">
                          <div className="document-meta">
                            <span>Author</span>
                            <strong>{doc.author}</strong>
                          </div>
                          <div className="document-meta">
                            <span>Published</span>
                            <strong>{formatTimestamp(doc.createdAt)}</strong>
                          </div>
                          <div className="document-content">
                            <span className="document-label">Title</span>
                            <p>{decrypted ? decrypted.title : 'Decrypt the company password to view.'}</p>
                          </div>
                          <div className="document-content">
                            <span className="document-label">Content</span>
                            <p>
                              {decrypted ? decrypted.body : `Encrypted payload: ${doc.encryptedBody}`}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          )}
        </section>

        {(statusMessage || actionError || zamaError) && (
          <section className="feedback">
            {statusMessage && <p className="feedback-success">{statusMessage}</p>}
            {(actionError || zamaError) && (
              <p className="feedback-error">{actionError ?? zamaError}</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
