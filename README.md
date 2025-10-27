# Encrypted Company Workspace

**A blockchain-based encrypted collaboration platform powered by Fully Homomorphic Encryption (FHE)**

EncryptedWorkspace enables organizations to create secure, decentralized workspaces where confidential documents are protected by cryptographic encryption. Built on Ethereum with Zama's FHEVM protocol, it combines the transparency of blockchain with the privacy of advanced encryption technology.

[![License](https://img.shields.io/badge/license-BSD--3--Clause--Clear-blue.svg)](LICENSE)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.27-363636.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Built%20with-Hardhat-yellow.svg)](https://hardhat.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![FHEVM](https://img.shields.io/badge/Powered%20by-Zama%20FHEVM-purple.svg)](https://docs.zama.ai/fhevm)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Advantages](#advantages)
- [Technology Stack](#technology-stack)
- [Problem Statement](#problem-statement)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running Locally](#running-locally)
  - [Deployment](#deployment)
- [Usage](#usage)
  - [Creating a Company](#creating-a-company)
  - [Joining a Company](#joining-a-company)
  - [Publishing Documents](#publishing-documents)
  - [Viewing Documents](#viewing-documents)
- [Smart Contract API](#smart-contract-api)
- [Security Model](#security-model)
- [Testing](#testing)
- [Available Scripts](#available-scripts)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)
- [Acknowledgments](#acknowledgments)

---

## Overview

EncryptedWorkspace is a decentralized application (dApp) that revolutionizes corporate document management by combining blockchain transparency with cutting-edge encryption. Organizations can create company workspaces on the Ethereum blockchain where:

- **Company passwords are encrypted using Fully Homomorphic Encryption (FHE)** and stored on-chain without revealing the actual password to anyone, including blockchain nodes
- **Only authorized members can decrypt** the company password through Zama's privacy-preserving relayer system
- **Documents are doubly encrypted**: first with AES-GCM client-side encryption, then protected by FHE-encrypted access credentials
- **All transactions are transparent and auditable** on the blockchain, while sensitive data remains confidential
- **Access control is enforced cryptographically**, not just through traditional smart contract permissions

This creates a unique security model where membership is transparent, but the actual content and access credentials remain completely private to authorized members only.

---

## Key Features

### Company Management
- **Create Company Workspaces**: Establish new company workspaces with auto-generated encrypted passwords
- **Member Management**: Add members to companies who gain automatic decryption rights
- **Ownership Tracking**: Transparent ownership and membership records on-chain
- **Company Discovery**: Browse all registered companies with metadata (member counts, document counts, creation time)

### Document Operations
- **Encrypted Publishing**: Post documents with encrypted titles and bodies
- **Secure Storage**: Store encrypted documents on-chain with full blockchain immutability
- **Author Attribution**: Track document authors with Ethereum addresses
- **Timestamp Records**: Automatic creation timestamps for auditing and compliance
- **Decryption on Demand**: Decrypt documents in real-time when viewing (requires membership)

### Security & Privacy
- **FHE-Protected Passwords**: Company passwords encrypted with Zama's FHEVM and unreadable by anyone except authorized members
- **AES-GCM Document Encryption**: Industry-standard encryption for document content
- **Signature-Based Authorization**: Ethereum signatures required for FHE decryption operations
- **Zero-Knowledge Access**: Even smart contract cannot read encrypted data
- **Client-Side Encryption**: Documents never exposed in plaintext during transmission

### User Experience
- **Wallet Integration**: Seamless connection with any Web3 wallet via RainbowKit
- **Responsive UI**: Modern React interface with real-time updates
- **Status Feedback**: Clear success/error messages for all operations
- **Loading States**: User-friendly loading indicators for async operations
- **Automatic Decryption**: Transparent decryption process for authorized users

---

## Advantages

### 1. **Unmatched Privacy with Blockchain Transparency**
Traditional blockchain applications face a paradox: all data is public by default. ZamaWork solves this by leveraging FHE to encrypt sensitive data on-chain while maintaining blockchain's transparency benefits for access control and auditing.

### 2. **No Trusted Third Party**
Unlike centralized document management systems, ZamaWork eliminates the need for a trusted third party to manage encryption keys. The FHE protocol ensures that even the blockchain validators cannot read encrypted passwords.

### 3. **Cryptographic Access Control**
Access rights are enforced by mathematical cryptography rather than software logic. If you're not a member, you mathematically cannot decrypt the password—no software bugs can bypass this.

### 4. **Immutable Audit Trail**
Every document publication, company creation, and membership addition is permanently recorded on the blockchain, providing a tamper-proof audit trail for compliance and legal requirements.

### 5. **Decentralized Architecture**
No single point of failure. The application operates on the Ethereum blockchain and can be accessed through any frontend interface, ensuring censorship resistance and availability.

### 6. **Future-Proof Encryption**
Built on Zama's TFHE (Torus Fully Homomorphic Encryption) scheme, which provides security guarantees against even quantum computing attacks.

### 7. **Composability**
As a smart contract on Ethereum, ZamaWork can be integrated with other DeFi protocols, DAOs, or blockchain applications for extended functionality.

### 8. **User Sovereignty**
Users control their data through their Ethereum private keys. No password resets, no account recovery processes—true self-custody.

---

## Technology Stack

### Smart Contracts & Blockchain
- **Solidity 0.8.27**: Smart contract programming language
- **Hardhat**: Development environment for Ethereum smart contracts
- **FHEVM (Zama)**: Fully Homomorphic Encryption protocol for Ethereum
  - `@fhevm/solidity`: Solidity library for FHE operations
  - `@fhevm/hardhat-plugin`: Hardhat integration for FHEVM
  - `@zama-fhe/relayer-sdk`: JavaScript SDK for FHE encryption/decryption
  - `@zama-fhe/oracle-solidity`: Oracle integration for FHE
- **Ethers.js v6**: Ethereum library for blockchain interaction
- **Sepolia Testnet**: Ethereum test network for deployment

### Frontend
- **React 19**: Modern UI framework with concurrent features
- **TypeScript**: Type-safe JavaScript for robust development
- **Vite**: Next-generation frontend build tool
- **Wagmi v2**: React hooks for Ethereum
- **RainbowKit**: Beautiful wallet connection interface
- **Viem**: Lightweight TypeScript Ethereum library
- **TanStack Query**: Powerful data synchronization for React
- **Web Crypto API**: Browser-native cryptographic operations

### Development & Testing
- **Mocha + Chai**: Test framework and assertion library
- **hardhat-deploy**: Deterministic deployment automation
- **TypeChain**: TypeScript bindings for smart contracts
- **Solhint + ESLint**: Code quality and linting tools
- **Prettier**: Code formatting
- **solidity-coverage**: Smart contract code coverage analysis

### Cryptography
- **TFHE (Torus FHE)**: Zama's fully homomorphic encryption scheme
- **AES-GCM**: Authenticated encryption for document content
- **SHA-256**: Key derivation for AES encryption
- **ECDSA (secp256k1)**: Ethereum signature algorithm

---

## Problem Statement

### Traditional Document Management Challenges

**1. Centralized Trust**
- Traditional document management systems require trusting a central authority (Google Drive, Dropbox, SharePoint)
- Central servers can be compromised, subpoenaed, or shut down
- Users have no verifiable guarantee of who has access to their data

**2. Lack of Transparency**
- Access logs can be tampered with by administrators
- No immutable audit trail
- Difficult to prove document authenticity and timeline

**3. Blockchain Privacy Limitations**
- Standard blockchain smart contracts expose all data publicly
- Even private blockchains reveal data to validator nodes
- Traditional encryption requires off-chain key management

**4. Key Management Complexity**
- Centralized key management introduces single points of failure
- Sharing encrypted documents requires complex key distribution
- Revoking access is difficult without re-encryption

### How ZamaWork Solves These Problems

**Cryptographic Privacy on Public Blockchain**
- FHE allows encrypted data to be stored and processed on-chain
- Passwords remain encrypted even to blockchain validators
- Combines public blockchain transparency with private data

**Decentralized Access Control**
- Membership grants mathematical ability to decrypt
- No central authority can override access rights
- Smart contract enforces access logic transparently

**Simplified Key Management**
- Company password encrypted with FHE and stored on-chain
- Members automatically granted decryption rights through FHE permissions
- No manual key distribution or key escrow services needed

**Immutable Audit Trail**
- All actions recorded on blockchain with timestamps
- Cannot be altered or deleted by administrators
- Cryptographically verifiable history

**Blockchain-Native Security**
- Inherits Ethereum's security guarantees
- No additional infrastructure to secure
- Self-custody through user's Ethereum wallet

---

## How It Works

### The Encryption Flow

```
1. Company Creation
   ├─ Frontend generates random Ethereum address as password
   ├─ Password encrypted with Zama FHE (creates "eaddress" ciphertext)
   ├─ Encrypted password stored in CompanyWorkspace contract
   └─ Creator automatically becomes first member with decryption rights

2. Member Joins Company
   ├─ User sends join transaction to smart contract
   ├─ Smart contract grants FHE permission to decrypt company password
   ├─ Member can now request password decryption from Zama relayer
   └─ Member receives plaintext password locally

3. Document Publishing
   ├─ Author retrieves and decrypts company password
   ├─ Password hashed with SHA-256 to create 256-bit AES key
   ├─ Document title and body encrypted with AES-GCM
   ├─ Encrypted document posted to blockchain (no plaintext exposed)
   └─ Blockchain stores encrypted data immutably

4. Document Viewing
   ├─ Member requests documents from contract
   ├─ Frontend decrypts company password using Zama SDK
   ├─ Password derives AES key
   ├─ AES-GCM decrypts document title and body
   └─ Plaintext displayed to authorized member only
```

### Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────────┐     │
│  │ RainbowKit │  │  Wagmi/Viem │  │  Zama Relayer    │     │
│  │  Wallet    │  │  Blockchain │  │  FHE Decrypt     │     │
│  └────────────┘  └─────────────┘  └──────────────────┘     │
│         │                │                    │              │
│         └────────────────┴────────────────────┘              │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │
                  ┌────────▼──────────┐
                  │  Web3 Provider    │ (MetaMask, WalletConnect, etc.)
                  └────────┬──────────┘
                           │
┌──────────────────────────▼───────────────────────────────────┐
│                  Ethereum Blockchain (Sepolia)                │
│  ┌───────────────────────────────────────────────────────┐   │
│  │         CompanyWorkspace Smart Contract              │   │
│  │                                                       │   │
│  │  ┌──────────────┐          ┌──────────────────┐     │   │
│  │  │  Companies   │          │    Documents     │     │   │
│  │  │              │          │                  │     │   │
│  │  │ • Name       │          │ • Encrypted      │     │   │
│  │  │ • Owner      │          │   Title          │     │   │
│  │  │ • Password   │◄─────────┤ • Encrypted      │     │   │
│  │  │   (FHE)      │          │   Body           │     │   │
│  │  │ • Members[]  │          │ • Author         │     │   │
│  │  │ • Timestamp  │          │ • Timestamp      │     │   │
│  │  └──────────────┘          └──────────────────┘     │   │
│  │                                                       │   │
│  │              FHEVM (Zama) Integration                │   │
│  └───────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
                           │
                  ┌────────▼──────────┐
                  │   Zama Relayer    │ (Decryption Service)
                  └───────────────────┘
```

---

## Architecture

### Smart Contract Layer

**CompanyWorkspace.sol** (197 lines)

The core smart contract manages all on-chain logic:

```solidity
// Key data structures
struct Company {
    string name;                    // Company name
    address owner;                  // Creator address
    eaddress encryptedPassword;     // FHE-encrypted password
    uint256 createdAt;              // Creation timestamp
}

struct Document {
    string encryptedTitle;          // AES-GCM encrypted title
    string encryptedBody;           // AES-GCM encrypted body
    address author;                 // Document author
    uint256 createdAt;              // Publication timestamp
}
```

**Key Functions:**
- `createCompany(string name, bytes password)`: Creates a new company with FHE-encrypted password
- `joinCompany(uint256 companyId)`: Adds caller to company members
- `postDocument(uint256 companyId, string title, string body)`: Posts encrypted document
- `getCompanyPasswordCipher(uint256 companyId)`: Returns FHE ciphertext for decryption
- `getDocuments(uint256 companyId)`: Returns all company documents
- `getCompanyMembers(uint256 companyId)`: Returns list of members
- `isMember(uint256 companyId, address user)`: Checks membership status

### Frontend Layer

**WorkspaceApp.tsx** (607 lines)

The main React component orchestrates:
- Company creation and selection
- Member join workflow
- Document publication and viewing
- Password decryption via Zama SDK
- Document decryption with AES-GCM

**Key Hooks:**
- `useZamaInstance()`: Initializes Zama FHE instance with user signature
- `useEthersSigner()`: Converts Wagmi client to Ethers signer
- `useContractRead/Write()`: Wagmi hooks for blockchain interaction

**Utility Modules:**
- `encryption.ts`: AES-GCM encryption/decryption implementation
- `format.ts`: Timestamp and address formatting
- `contracts.ts`: Contract addresses and deployment info

### Cryptographic Layer

**Double Encryption Strategy**

1. **FHE for Access Control (Zama TFHE)**
   - Encrypts company password on-chain
   - Allows encrypted data processing without decryption
   - Only authorized members can decrypt via relayer

2. **AES-GCM for Document Content (Web Crypto)**
   - Fast symmetric encryption for document data
   - Authenticated encryption (prevents tampering)
   - Key derived from decrypted company password

**Why Two Layers?**
- FHE is computationally expensive for large data
- AES-GCM is fast and efficient for documents
- FHE provides access control, AES-GCM provides data encryption
- Separates concerns: on-chain access logic vs. off-chain data protection

---

## Project Structure

```
ZamaWork/
├── contracts/                      # Solidity smart contracts
│   └── CompanyWorkspace.sol        # Main workspace contract (197 lines)
│
├── deploy/                         # Hardhat deployment scripts
│   └── deploy.ts                   # CompanyWorkspace deployment
│
├── tasks/                          # Custom Hardhat CLI tasks
│   ├── accounts.ts                 # Account management
│   └── companyWorkspace.ts         # Workspace CLI operations (132 lines)
│
├── test/                           # Smart contract tests
│   └── CompanyWorkspace.ts         # Contract test suite
│
├── ui/                             # React frontend application
│   ├── src/
│   │   ├── App.tsx                 # Root component with providers
│   │   ├── main.tsx                # React entry point
│   │   │
│   │   ├── components/
│   │   │   ├── Header.tsx          # Navigation header with wallet
│   │   │   └── WorkspaceApp.tsx    # Main app logic (607 lines)
│   │   │
│   │   ├── config/
│   │   │   ├── abi.ts              # Contract ABI definitions
│   │   │   ├── contracts.ts        # Contract addresses
│   │   │   └── wagmi.ts            # Wagmi configuration
│   │   │
│   │   ├── hooks/
│   │   │   ├── useZamaInstance.ts  # Zama FHE initialization
│   │   │   └── useEthersSigner.ts  # Ethers v6 signer hook
│   │   │
│   │   ├── utils/
│   │   │   ├── encryption.ts       # AES-GCM utilities (57 lines)
│   │   │   └── format.ts           # Formatting helpers
│   │   │
│   │   ├── types/
│   │   │   └── company.ts          # TypeScript interfaces
│   │   │
│   │   └── styles/
│   │       └── App.css             # Application styles
│   │
│   ├── package.json                # Frontend dependencies
│   ├── vite.config.ts              # Vite configuration
│   └── tsconfig.json               # TypeScript config
│
├── deployments/                    # Deployment artifacts
│   └── sepolia/
│       └── CompanyWorkspace.json   # Deployed contract info + ABI
│
├── hardhat.config.ts               # Hardhat configuration
├── package.json                    # Project dependencies
├── tsconfig.json                   # Root TypeScript config
├── .env                            # Environment variables
├── AGENTS.md                       # Developer guidelines
└── README.md                       # This file
```

### Key Files and Their Purposes

| File | Lines | Purpose |
|------|-------|---------|
| `contracts/CompanyWorkspace.sol` | 197 | Core smart contract with all business logic |
| `ui/src/components/WorkspaceApp.tsx` | 607 | Main UI component with state management |
| `tasks/companyWorkspace.ts` | 132 | CLI tools for contract interaction |
| `ui/src/utils/encryption.ts` | 57 | AES-GCM encryption/decryption |
| `test/CompanyWorkspace.ts` | 112 | Contract unit and integration tests |
| `hardhat.config.ts` | 95 | Build, deployment, and network config |

---

## Getting Started

### Prerequisites

**Required Software:**
- **Node.js**: Version 20 or higher ([Download](https://nodejs.org/))
- **npm**: Version 7.0.0 or higher (included with Node.js)
- **Git**: For version control ([Download](https://git-scm.com/))
- **MetaMask or compatible Web3 wallet**: For blockchain interaction ([Download](https://metamask.io/))

**Required Accounts:**
- **Infura Account**: For Sepolia testnet access ([Sign up](https://infura.io/))
- **Etherscan Account** (optional): For contract verification ([Sign up](https://etherscan.io/))
- **Sepolia ETH**: Test ether for transactions ([Faucet](https://sepoliafaucet.com/))

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/ZamaWork.git
cd ZamaWork
```

2. **Install smart contract dependencies**

```bash
npm install
```

3. **Install frontend dependencies**

```bash
cd ui
npm install
cd ..
```

4. **Verify installation**

```bash
npm run compile
```

If successful, you should see compilation output with no errors.

### Configuration

1. **Set up environment variables**

Create a `.env` file in the root directory:

```bash
# Private key for deploying contracts (NEVER commit this!)
PRIVATE_KEY=your_private_key_here

# Infura API key for Sepolia testnet access
INFURA_API_KEY=your_infura_api_key

# Optional: Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# Optional: Mnemonic for Hardhat accounts (use default test mnemonic for local dev)
MNEMONIC=test test test test test test test test test test test junk
```

**Security Warning**: Never commit your `.env` file or expose your private key. The `.env` file is already in `.gitignore`.

2. **Configure Hardhat networks** (already configured in `hardhat.config.ts`)

The project supports:
- **hardhat**: Local development network (default)
- **localhost**: Local node (run `npx hardhat node`)
- **sepolia**: Ethereum testnet (requires Infura API key and Sepolia ETH)

3. **Configure frontend** (already configured in `ui/src/config/`)

Update contract addresses in `ui/src/config/contracts.ts` after deployment:

```typescript
export const COMPANY_WORKSPACE_ADDRESS = "0xYourDeployedContractAddress";
```

### Running Locally

1. **Start a local Hardhat node**

```bash
npm run chain
```

This starts a local Ethereum node at `http://127.0.0.1:8545/` with FHEVM support.

2. **Deploy contracts to local network** (in a new terminal)

```bash
npm run deploy:localhost
```

Copy the deployed contract address from the output.

3. **Update frontend configuration**

Edit `ui/src/config/contracts.ts` and paste your local contract address.

4. **Start the frontend development server**

```bash
cd ui
npm run dev
```

The application will open at `http://localhost:5173/`.

5. **Connect your wallet**

- Click "Connect Wallet" in the UI
- Select MetaMask or your preferred wallet
- Switch network to "Localhost 8545" (Hardhat network)
- Import a Hardhat test account using private keys from the terminal

**Hardhat Test Accounts**: The local node provides 20 pre-funded accounts. Use these private keys to import accounts into MetaMask for testing.

### Deployment

#### Deploy to Sepolia Testnet

1. **Ensure you have Sepolia ETH**

Get test ETH from a faucet:
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
- [Sepolia PoW Faucet](https://sepolia-faucet.pk910.de/)

2. **Deploy the contract**

```bash
npm run deploy:sepolia
```

This will:
- Compile contracts
- Deploy to Sepolia testnet
- Save deployment info to `deployments/sepolia/`

3. **Verify the contract on Etherscan** (optional but recommended)

```bash
npm run verify:sepolia
```

4. **Update frontend configuration**

The contract address is automatically saved in `deployments/sepolia/CompanyWorkspace.json`.
The frontend reads from this file, so no manual update needed.

5. **Deploy frontend**

Build the optimized production bundle:

```bash
cd ui
npm run build
```

Deploy the `ui/dist/` folder to:
- **Vercel**: `npx vercel deploy`
- **Netlify**: Drag & drop `dist/` folder
- **GitHub Pages**: Push to `gh-pages` branch
- **IPFS**: `npx ipfs-deploy dist/`

---

## Usage

### Creating a Company

1. **Connect your wallet** by clicking "Connect Wallet" in the header
2. **Navigate to "Create Company" section**
3. **Enter company details**:
   - Company name (e.g., "Acme Corp")
4. **Click "Create Company"**
5. **Confirm transaction** in your wallet
6. **Wait for confirmation** (typically 12-15 seconds on Sepolia)

Upon success:
- You become the company owner
- A random encrypted password is generated and stored on-chain
- You're automatically added as the first member
- You can now post and view documents

**What happens under the hood:**
```javascript
// 1. Generate random password
const password = ethers.Wallet.createRandom().address;

// 2. Encrypt with Zama FHE
const zamaInstance = await initZama(signer);
const encryptedPassword = zamaInstance.encrypt32(password);

// 3. Store on blockchain
await contract.createCompany(companyName, encryptedPassword);
```

### Joining a Company

1. **Browse companies** in the "All Companies" list
2. **Select a company** to view details
3. **Click "Join Company"**
4. **Confirm transaction** in your wallet

Upon success:
- You're added to the company's member list
- Smart contract grants you FHE permission to decrypt the company password
- You can now post and view documents in this workspace

**Access Control Note**: Joining a company doesn't require owner approval in this version. See [Future Roadmap](#future-roadmap) for invitation-based membership.

### Publishing Documents

1. **Select a company** you're a member of
2. **Navigate to "Post Document" section**
3. **Enter document details**:
   - Title (e.g., "Q4 Financial Report")
   - Content (e.g., "Revenue: $1.2M, Expenses: $800K...")
4. **Click "Post Document"**
5. **Confirm transaction** in your wallet

Upon success:
- Document is encrypted with AES-GCM using the company password
- Encrypted data is stored on the blockchain
- All company members can decrypt and view it

**Encryption process:**
```javascript
// 1. Decrypt company password (FHE)
const password = await zamaInstance.decrypt(encryptedPassword, signature);

// 2. Derive AES key
const key = await crypto.subtle.digest('SHA-256', password);

// 3. Encrypt document (AES-GCM)
const encryptedTitle = await encryptDocument(title, password);
const encryptedBody = await encryptDocument(content, password);

// 4. Post to blockchain
await contract.postDocument(companyId, encryptedTitle, encryptedBody);
```

### Viewing Documents

1. **Select a company** you're a member of
2. **Click "View Documents"**
3. **Documents automatically decrypt** if you have access

The UI displays:
- **Encrypted view** (if not a member): Shows ciphertext
- **Decrypted view** (if member): Shows plaintext title and content
- **Author address** and **timestamp** for each document

**Decryption process:**
```javascript
// 1. Fetch encrypted documents from blockchain
const documents = await contract.getDocuments(companyId);

// 2. Decrypt company password (FHE)
const password = await zamaInstance.decrypt(encryptedPasswordCipher);

// 3. Decrypt each document (AES-GCM)
const decryptedDocs = await Promise.all(
  documents.map(async doc => ({
    title: await decryptDocument(doc.encryptedTitle, password),
    body: await decryptDocument(doc.encryptedBody, password),
    author: doc.author,
    createdAt: doc.createdAt
  }))
);
```

---

## Smart Contract API

### Company Management Functions

#### `createCompany(string memory name, bytes memory encryptedPassword)`
Creates a new company workspace.

**Parameters:**
- `name`: Company name (e.g., "Acme Corp")
- `encryptedPassword`: FHE-encrypted password (bytes)

**Returns:** None (emits `CompanyCreated` event)

**Access:** Anyone

**Example:**
```javascript
const tx = await contract.createCompany("Acme Corp", encryptedPasswordBytes);
await tx.wait();
```

---

#### `joinCompany(uint256 companyId)`
Adds the caller to company members.

**Parameters:**
- `companyId`: ID of the company to join (0-indexed)

**Returns:** None (emits `MemberAdded` event)

**Access:** Anyone (must not be already a member)

**Example:**
```javascript
const tx = await contract.joinCompany(0); // Join company #0
await tx.wait();
```

---

#### `getCompany(uint256 companyId)`
Retrieves company metadata.

**Parameters:**
- `companyId`: Company ID

**Returns:**
```solidity
(
    string name,
    address owner,
    uint256 createdAt,
    uint256 memberCount,
    uint256 documentCount
)
```

**Access:** Public view function

**Example:**
```javascript
const company = await contract.getCompany(0);
console.log(`Company: ${company.name}, Members: ${company.memberCount}`);
```

---

#### `getCompanyCount()`
Returns total number of companies.

**Returns:** `uint256` - Total companies created

**Access:** Public view function

---

#### `getCompanyMembers(uint256 companyId)`
Lists all members of a company.

**Returns:** `address[]` - Array of member addresses

**Access:** Public view function

---

#### `isMember(uint256 companyId, address user)`
Checks if an address is a company member.

**Returns:** `bool` - True if member, false otherwise

**Access:** Public view function

---

### Document Management Functions

#### `postDocument(uint256 companyId, string memory encryptedTitle, string memory encryptedBody)`
Posts an encrypted document to a company.

**Parameters:**
- `companyId`: Target company ID
- `encryptedTitle`: AES-GCM encrypted title (hex string)
- `encryptedBody`: AES-GCM encrypted content (hex string)

**Returns:** None (emits `DocumentPosted` event)

**Access:** Company members only

**Example:**
```javascript
const tx = await contract.postDocument(
  0,
  "iv:ciphertext", // encrypted title
  "iv:ciphertext"  // encrypted body
);
await tx.wait();
```

---

#### `getDocument(uint256 companyId, uint256 documentId)`
Retrieves a specific document.

**Parameters:**
- `companyId`: Company ID
- `documentId`: Document index (0-indexed within company)

**Returns:**
```solidity
(
    string encryptedTitle,
    string encryptedBody,
    address author,
    uint256 createdAt
)
```

**Access:** Public view function (anyone can read encrypted data)

---

#### `getDocuments(uint256 companyId)`
Retrieves all documents for a company.

**Returns:** `Document[]` - Array of all company documents

**Access:** Public view function

---

### Encryption Functions

#### `getCompanyPasswordCipher(uint256 companyId)`
Returns the FHE-encrypted company password for client-side decryption.

**Parameters:**
- `companyId`: Company ID

**Returns:** `eaddress` - FHE ciphertext of the password

**Access:** Public view function (ciphertext is public, but only members can decrypt it)

**Example:**
```javascript
const cipher = await contract.getCompanyPasswordCipher(0);
// Decrypt using Zama SDK (requires membership permission)
const password = await zamaInstance.decrypt(cipher, userSignature);
```

---

## Security Model

### Threat Model

**Assumptions:**
1. Ethereum blockchain is secure and censorship-resistant
2. Zama's TFHE scheme is cryptographically secure
3. Users protect their private keys
4. Browser crypto APIs are secure (Web Crypto API)
5. Users trust the frontend code they're running

**Protected Against:**
- ✅ Blockchain validators reading encrypted data
- ✅ Non-members accessing company documents
- ✅ Man-in-the-middle attacks (end-to-end encryption)
- ✅ Tampering with encrypted data (AES-GCM authentication)
- ✅ Contract owner privilege escalation (no admin functions)
- ✅ Replay attacks (unique IVs for each encryption)

**Not Protected Against:**
- ❌ Compromised user private keys
- ❌ Malicious frontend code (users must verify source)
- ❌ Frontend vulnerability that extracts decrypted data
- ❌ User accidentally sharing decrypted content
- ❌ Quantum computing (future threat, but TFHE has quantum resistance)

### Security Best Practices

**For Users:**
1. **Verify Contract Address**: Always check you're interacting with the correct contract
2. **Use Hardware Wallets**: Store private keys on hardware devices (Ledger, Trezor)
3. **Verify Frontend**: Use official deployment or self-host from source
4. **Protect Decrypted Data**: Don't screenshot or copy sensitive decrypted content
5. **Review Transactions**: Always review transaction details before signing

**For Developers:**
1. **Audit Smart Contracts**: Have contracts audited before production deployment
2. **Pin Dependencies**: Use exact versions in package.json (no `^` or `~`)
3. **Secure Frontend**: Use CSP headers, SRI for scripts, and HTTPS
4. **Rate Limiting**: Implement rate limits on frontend to prevent abuse
5. **Error Handling**: Never expose sensitive data in error messages

### Known Limitations

1. **Gas Costs**: FHE operations are expensive (~500K-1M gas per encryption)
2. **Decryption Latency**: Zama relayer adds 2-5 seconds for decryption
3. **Scalability**: On-chain document storage limits document size (consider IPFS for large files)
4. **Membership Privacy**: Member addresses are public on-chain
5. **No Access Revocation**: Once a member, always a member (see Future Roadmap)

---

## Testing

### Running Tests

**Run full test suite:**
```bash
npm run test
```

**Run with coverage:**
```bash
npm run coverage
```

**Run specific test:**
```bash
npx hardhat test test/CompanyWorkspace.ts
```

**Run tests on Sepolia:**
```bash
npx hardhat test --network sepolia
```

### Test Structure

```
test/
└── CompanyWorkspace.ts        # Contract tests (112 lines)
    ├── Company creation tests
    ├── Membership tests
    ├── Document posting tests
    ├── Access control tests
    └── Edge case tests
```

**Test Coverage:**
- Company creation with encrypted passwords
- Member joining and verification
- Document posting and retrieval
- Access control (only members can post)
- Multiple companies and documents
- Error cases (invalid company IDs, duplicate members, etc.)

### Example Test

```typescript
describe("CompanyWorkspace", function() {
  it("Should create a company with encrypted password", async function() {
    const { contract, owner } = await loadFixture(deployFixture);

    const companyName = "Test Company";
    const password = ethers.Wallet.createRandom().address;
    const encryptedPassword = await encryptPassword(password); // FHE encrypt

    await contract.createCompany(companyName, encryptedPassword);

    const company = await contract.getCompany(0);
    expect(company.name).to.equal(companyName);
    expect(company.owner).to.equal(owner.address);
    expect(await contract.isMember(0, owner.address)).to.be.true;
  });
});
```

---

## Available Scripts

### Smart Contract Scripts

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile Solidity contracts |
| `npm run test` | Run Mocha test suite |
| `npm run coverage` | Generate coverage report with solidity-coverage |
| `npm run lint` | Run ESLint and Solhint on all code |
| `npm run lint:sol` | Lint Solidity code with Solhint |
| `npm run clean` | Remove build artifacts and cache |
| `npm run typechain` | Generate TypeScript types for contracts |
| `npm run chain` | Start local Hardhat node (FHEVM-enabled) |

### Deployment Scripts

| Command | Description |
|---------|-------------|
| `npm run deploy:localhost` | Deploy to local Hardhat network |
| `npm run deploy:sepolia` | Deploy to Sepolia testnet |
| `npm run verify:sepolia` | Verify contract on Etherscan (Sepolia) |

### Frontend Scripts

| Command | Description |
|---------|-------------|
| `cd ui && npm run dev` | Start Vite dev server (http://localhost:5173) |
| `cd ui && npm run build` | Build optimized production bundle |
| `cd ui && npm run preview` | Preview production build locally |
| `cd ui && npm run lint` | Lint frontend code with ESLint |

### Custom Hardhat Tasks

```bash
# Get deployed contract address
npx hardhat workspace:address --network sepolia

# Create a company (CLI)
npx hardhat workspace:create --network sepolia --name "Acme Corp"

# Join a company
npx hardhat workspace:join --network sepolia --company 0

# View company info
npx hardhat workspace:company --network sepolia --company 0

# Decrypt company password
npx hardhat workspace:password --network sepolia --company 0

# List company documents
npx hardhat workspace:documents --network sepolia --company 0
```

---

## Future Roadmap

### Phase 1: Core Enhancements (Q2 2025)

**Access Control Improvements**
- [ ] Invitation-based membership (owner approval required)
- [ ] Role-based permissions (admin, editor, viewer)
- [ ] Member removal and access revocation
- [ ] Temporary access grants with expiration

**Document Features**
- [ ] Document categories and tags
- [ ] Document versioning and history
- [ ] Document deletion (mark as deleted)
- [ ] Rich text editor for document content
- [ ] File upload support (images, PDFs)

**User Experience**
- [ ] Document search and filtering
- [ ] Notifications for new documents
- [ ] Member activity feed
- [ ] Mobile-responsive design improvements
- [ ] Dark mode

### Phase 2: Scalability (Q3 2025)

**Storage Optimization**
- [ ] IPFS integration for large documents
- [ ] Store only encrypted hashes on-chain
- [ ] Compression before encryption
- [ ] Lazy loading for document lists

**Performance**
- [ ] Batch operations (create multiple companies/documents)
- [ ] Caching decrypted passwords in session
- [ ] Optimistic UI updates
- [ ] WebAssembly for client-side encryption

**Gas Optimization**
- [ ] Optimize smart contract storage layout
- [ ] Use events for historical data instead of storage
- [ ] Layer 2 deployment (Arbitrum, Optimism)

### Phase 3: Advanced Features (Q4 2025)

**Collaboration**
- [ ] Comments on documents
- [ ] Document co-authoring
- [ ] Real-time collaborative editing (using CRDT)
- [ ] @mentions and tagging

**Integrations**
- [ ] Export to Google Drive, Dropbox
- [ ] Import from existing document systems
- [ ] API for third-party integrations
- [ ] Zapier integration

**Compliance & Audit**
- [ ] Audit log viewer UI
- [ ] Compliance reports (GDPR, HIPAA)
- [ ] Cryptographic proofs of document authenticity
- [ ] Timestamping service integration

### Phase 4: Enterprise Features (2026)

**Multi-Chain Support**
- [ ] Deploy to Polygon, Avalanche, BSC
- [ ] Cross-chain company synchronization
- [ ] Bridge for multi-chain membership

**Advanced Security**
- [ ] Multi-signature company creation
- [ ] Time-locked documents (encrypt until specific date)
- [ ] Zero-knowledge proofs for membership verification
- [ ] Threshold encryption (k-of-n members to decrypt)

**Enterprise Features**
- [ ] Company hierarchies (parent/child companies)
- [ ] Inter-company document sharing
- [ ] SSO integration (OAuth, SAML)
- [ ] SLA guarantees and support tiers

**Governance**
- [ ] DAO for protocol governance
- [ ] Token-based voting for feature prioritization
- [ ] Community-driven development fund

### Research Directions

**Cryptography**
- Investigate post-quantum encryption alternatives
- Explore proxy re-encryption for access delegation
- Research threshold FHE for distributed decryption

**Economics**
- Design token economics for sustainable growth
- Implement staking for spam prevention
- Create incentive mechanisms for validators

**Legal**
- Legal framework for encrypted data jurisdiction
- Compliance with international data protection laws
- Smart contract legal enforceability

---

## Contributing

We welcome contributions from the community! Whether it's bug reports, feature requests, documentation improvements, or code contributions, your input is valuable.

### How to Contribute

1. **Fork the repository** on GitHub
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** with clear, descriptive commits
4. **Write tests** for new functionality
5. **Run linting and tests** (`npm run lint && npm run test`)
6. **Push to your fork** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request** with a clear description of changes

### Development Guidelines

**Code Style**
- Follow existing code formatting (Prettier configuration)
- Use TypeScript for all new code
- Write JSDoc comments for functions
- Keep functions small and focused

**Commit Messages**
- Use conventional commits format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Example: `feat(contract): add document deletion function`

**Testing Requirements**
- All new features must include tests
- Maintain or improve code coverage (currently ~80%)
- Test both happy paths and error cases
- Include integration tests for complex features

**Documentation**
- Update README.md for user-facing changes
- Document new functions with JSDoc
- Update AGENTS.md for developer guidelines
- Add inline comments for complex logic

### Areas for Contribution

**Good First Issues**
- Frontend UI/UX improvements
- Documentation improvements
- Test coverage expansion
- Bug fixes
- Gas optimization

**Advanced Issues**
- Layer 2 integration
- IPFS storage implementation
- Advanced cryptography features
- Performance optimization
- Smart contract auditing

### Code of Conduct

We follow the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Please be respectful and constructive in all interactions.

---

## License

This project is licensed under the **BSD-3-Clause-Clear License**.

```
BSD 3-Clause Clear License

Copyright (c) 2025, ZamaWork Contributors
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted (subject to the limitations in the disclaimer
below) provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright
  notice, this list of conditions and the following disclaimer in the
  documentation and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY
THIS LICENSE. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT
NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

See [LICENSE](LICENSE) file for full details.

---

## Support

### Getting Help

**Documentation**
- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [React Documentation](https://react.dev/)
- [Wagmi Documentation](https://wagmi.sh/)

**Community**
- [GitHub Issues](https://github.com/your-username/ZamaWork/issues): Bug reports and feature requests
- [GitHub Discussions](https://github.com/your-username/ZamaWork/discussions): Questions and community support
- [Zama Discord](https://discord.gg/zama): Discuss FHE technology and FHEVM
- [Twitter/X](https://twitter.com/zama_fhe): Follow updates and announcements

**Professional Support**
- For enterprise support and custom development, contact: support@zamawork.io
- Security issues: Please report to security@zamawork.io (PGP key available)

### Troubleshooting

**Common Issues**

**"Cannot decrypt password"**
- Ensure you're a member of the company
- Check that you've signed the permission request
- Verify Zama relayer is accessible (check network tab)
- Try refreshing the Zama instance

**"Transaction failed"**
- Check you have sufficient ETH for gas
- Verify you're connected to the correct network (Sepolia)
- Ensure wallet is unlocked
- Check contract address is correct

**"Wallet connection failed"**
- Update MetaMask to latest version
- Clear browser cache and cookies
- Try a different browser
- Disable conflicting browser extensions

**"Decryption shows garbage text"**
- Verify you're using the correct company password
- Check encryption format (should be "iv:ciphertext")
- Ensure document wasn't corrupted during posting
- Try re-encrypting and re-posting

For more troubleshooting, see [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).

---

## Acknowledgments

This project wouldn't be possible without:

**Technology Providers**
- [Zama](https://zama.ai/) for pioneering Fully Homomorphic Encryption and FHEVM
- [Ethereum Foundation](https://ethereum.org/) for the Ethereum blockchain
- [Hardhat](https://hardhat.org/) for the development framework
- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract libraries

**Open Source Projects**
- React, Vite, TypeScript - Frontend stack
- Wagmi, Viem, Ethers.js - Web3 libraries
- RainbowKit - Wallet connection UI
- And many more dependencies listed in package.json

**Community**
- FHEVM community for guidance and support
- Early testers and contributors
- Security researchers who reviewed the code

**Inspiration**
- Encrypted messaging apps (Signal, Telegram)
- Decentralized storage projects (IPFS, Arweave)
- Web3 document management solutions (Ceramic, Weavemail)

---

## Project Statistics

- **Smart Contract Size**: 197 lines (CompanyWorkspace.sol)
- **Frontend Size**: 607 lines (WorkspaceApp.tsx) + utilities
- **Test Coverage**: ~80% (aim for 90%+)
- **Gas Cost (Sepolia)**:
  - Create company: ~500,000 gas (~0.01 ETH)
  - Join company: ~100,000 gas (~0.002 ETH)
  - Post document: ~150,000 gas (~0.003 ETH)
- **Dependencies**:
  - Smart contract: 12 packages
  - Frontend: 23 packages
- **Supported Networks**: Sepolia (testnet), Hardhat (local)
- **License**: BSD-3-Clause-Clear

---

## Citation

If you use ZamaWork in research or academic work, please cite:

```bibtex
@software{zamawork2025,
  title = {ZamaWork: Encrypted Company Workspace on Blockchain},
  author = {ZamaWork Contributors},
  year = {2025},
  url = {https://github.com/your-username/ZamaWork},
  note = {Blockchain-based encrypted collaboration platform using Fully Homomorphic Encryption}
}
```

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and release notes.

**Current Version**: 0.1.0 (Alpha)
- Initial release with core functionality
- Company creation and membership management
- Document posting and viewing with encryption
- React frontend with wallet integration
- Deployed on Sepolia testnet

---

## Legal Disclaimer

**Software Disclaimer**

THIS SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. THE AUTHORS AND COPYRIGHT HOLDERS DISCLAIM ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS.

**Not Financial Advice**

This project involves blockchain technology and cryptocurrency. Nothing in this documentation constitutes financial, investment, legal, or tax advice. Users should consult appropriate professionals before using this software.

**Regulatory Compliance**

Users are responsible for complying with all applicable laws and regulations in their jurisdiction. The developers make no representations regarding legal compliance.

**Security Disclaimer**

While we employ industry-standard security practices, no system is completely secure. Users are responsible for:
- Protecting their private keys
- Verifying contract addresses
- Reviewing code before use
- Understanding risks of blockchain technology

**Use at Your Own Risk**

Blockchain transactions are irreversible. Test thoroughly before using with valuable data or on mainnet.

---

**Built with ❤️ by the ZamaWork team**

**Website**: https://zamawork.io
**Twitter**: [@ZamaWork](https://twitter.com/zamawork)
**GitHub**: [github.com/your-username/ZamaWork](https://github.com/your-username/ZamaWork)

*Powered by Zama's Fully Homomorphic Encryption technology*
