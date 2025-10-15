// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, eaddress, externalEaddress} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract CompanyWorkspace is SepoliaConfig {
    struct Company {
        string name;
        address owner;
        eaddress encryptedPassword;
        uint256 createdAt;
    }

    struct Document {
        string encryptedTitle;
        string encryptedBody;
        address author;
        uint256 createdAt;
    }

    uint256 private _nextCompanyId = 1;
    mapping(uint256 => Company) private _companies;
    mapping(uint256 => address[]) private _companyMembers;
    mapping(uint256 => mapping(address => bool)) private _memberLookup;
    mapping(uint256 => Document[]) private _documents;

    event CompanyCreated(uint256 indexed companyId, string name, address indexed owner);
    event MemberJoined(uint256 indexed companyId, address indexed member);
    event DocumentPosted(uint256 indexed companyId, uint256 indexed documentId, address indexed author);

    error CompanyNotFound();
    error EmptyName();
    error EmptyTitle();
    error EmptyBody();
    error AlreadyMember();
    error NotMember();
    error InvalidDocument();

    modifier companyExists(uint256 companyId) {
        if (_companies[companyId].owner == address(0)) {
            revert CompanyNotFound();
        }
        _;
    }

    modifier onlyMember(uint256 companyId) {
        if (!_memberLookup[companyId][msg.sender]) {
            revert NotMember();
        }
        _;
    }

    function createCompany(
        string calldata name,
        externalEaddress encryptedPasswordHandle,
        bytes calldata inputProof
    ) external returns (uint256) {
        if (bytes(name).length == 0) {
            revert EmptyName();
        }

        eaddress encryptedPassword = FHE.fromExternal(encryptedPasswordHandle, inputProof);

        uint256 companyId = _nextCompanyId++;

        Company storage company = _companies[companyId];
        company.name = name;
        company.owner = msg.sender;
        company.encryptedPassword = encryptedPassword;
        company.createdAt = block.timestamp;

        _companyMembers[companyId].push(msg.sender);
        _memberLookup[companyId][msg.sender] = true;

        FHE.allowThis(company.encryptedPassword);
        FHE.allow(company.encryptedPassword, msg.sender);

        emit CompanyCreated(companyId, name, msg.sender);

        return companyId;
    }

    function joinCompany(uint256 companyId) external companyExists(companyId) {
        if (_memberLookup[companyId][msg.sender]) {
            revert AlreadyMember();
        }

        _companyMembers[companyId].push(msg.sender);
        _memberLookup[companyId][msg.sender] = true;

        FHE.allow(_companies[companyId].encryptedPassword, msg.sender);

        emit MemberJoined(companyId, msg.sender);
    }

    function postDocument(
        uint256 companyId,
        string calldata encryptedTitle,
        string calldata encryptedBody
    ) external companyExists(companyId) onlyMember(companyId) {
        if (bytes(encryptedTitle).length == 0) {
            revert EmptyTitle();
        }
        if (bytes(encryptedBody).length == 0) {
            revert EmptyBody();
        }

        Document memory doc = Document({
            encryptedTitle: encryptedTitle,
            encryptedBody: encryptedBody,
            author: msg.sender,
            createdAt: block.timestamp
        });

        _documents[companyId].push(doc);
        uint256 documentId = _documents[companyId].length - 1;

        emit DocumentPosted(companyId, documentId, msg.sender);
    }

    function getCompany(uint256 companyId)
        external
        view
        companyExists(companyId)
        returns (
            string memory name,
            address owner,
            bytes32 encryptedPassword,
            uint256 createdAt,
            uint256 memberCount,
            uint256 documentCount
        )
    {
        Company storage company = _companies[companyId];
        return (
            company.name,
            company.owner,
            FHE.toBytes32(company.encryptedPassword),
            company.createdAt,
            _companyMembers[companyId].length,
            _documents[companyId].length
        );
    }

    function getCompanyCount() external view returns (uint256) {
        return _nextCompanyId - 1;
    }

    function getCompanyMembers(uint256 companyId)
        external
        view
        companyExists(companyId)
        returns (address[] memory)
    {
        return _companyMembers[companyId];
    }

    function isMember(uint256 companyId, address account)
        external
        view
        companyExists(companyId)
        returns (bool)
    {
        return _memberLookup[companyId][account];
    }

    function getDocument(uint256 companyId, uint256 documentId)
        external
        view
        companyExists(companyId)
        returns (Document memory)
    {
        if (documentId >= _documents[companyId].length) {
            revert InvalidDocument();
        }
        return _documents[companyId][documentId];
    }

    function getDocuments(uint256 companyId)
        external
        view
        companyExists(companyId)
        returns (Document[] memory)
    {
        return _documents[companyId];
    }

    function getCompanyPasswordCipher(uint256 companyId)
        external
        view
        companyExists(companyId)
        returns (bytes32)
    {
        return FHE.toBytes32(_companies[companyId].encryptedPassword);
    }
}
