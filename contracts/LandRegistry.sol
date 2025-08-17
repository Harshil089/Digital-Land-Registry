// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LandRegistry {
    // Roles
    address public admin;
    mapping(address => bool) public officer;
    mapping(address => bool) public bankOrOfficer;

    constructor() {
        admin = msg.sender;
        officer[msg.sender] = true;
        bankOrOfficer[msg.sender] = true;
    }

    modifier onlyOfficer() {
        require(officer[msg.sender], "Not officer");
        _;
    }

    modifier onlyBankOrOfficer() {
        require(bankOrOfficer[msg.sender], "Not bank/officer");
        _;
    }

    // Data models
    struct Parcel {
        uint256 parcelId;
        bytes32 geoHash;
        uint256 area;
        string locationCode;
        string landUse;
        bool activeEncumbrance;
        bool exists;
    }

    struct Ownership {
        address owner;
        uint256 startBlock;
        address prevOwner;
    }

    struct AllocationProgram {
        uint256 programId;
        uint256[] parcelIds;
        bool closed;
        bool exists;
    }

    mapping(uint256 => Parcel) public parcels;
    mapping(uint256 => Ownership) public ownerships;
    mapping(uint256 => AllocationProgram) public programs;
    mapping(uint256 => address[]) public applications;
    mapping(uint256 => address[]) public winners;

    // Events
    event ParcelCreated(uint256 parcelId, bytes32 geoHash, uint256 area, string locationCode, string landUse);
    event OwnershipTransferred(uint256 parcelId, address from, address to);
    event EncumbranceSet(uint256 parcelId, bool flag);
    event ProgramCreated(uint256 programId, uint256[] parcelIds);
    event Applied(uint256 programId, address applicant);
    event Allocated(uint256 programId, address[] winners);

    // Role management
    function setOfficer(address acct, bool isOfficer) external {
        require(msg.sender == admin, "Only admin");
        officer[acct] = isOfficer;
        bankOrOfficer[acct] = isOfficer || bankOrOfficer[acct];
    }

    function setBankOrOfficer(address acct, bool isAuth) external {
        require(msg.sender == admin, "Only admin");
        bankOrOfficer[acct] = isAuth;
    }

    // Create parcel
    function createParcel(
        uint256 parcelId,
        bytes32 geoHash,
        uint256 area,
        string calldata locationCode,
        string calldata landUse,
        address initialOwner
    ) external onlyOfficer {
        require(!parcels[parcelId].exists, "Parcel exists");
        parcels[parcelId] = Parcel(parcelId, geoHash, area, locationCode, landUse, false, true);
        ownerships[parcelId] = Ownership(initialOwner, block.number, address(0));
        emit ParcelCreated(parcelId, geoHash, area, locationCode, landUse);
        emit OwnershipTransferred(parcelId, address(0), initialOwner);
    }

    // Set encumbrance
    function setEncumbrance(uint256 parcelId, bool flag) external onlyBankOrOfficer {
        require(parcels[parcelId].exists, "No parcel");
        parcels[parcelId].activeEncumbrance = flag;
        emit EncumbranceSet(parcelId, flag);
    }

    // Transfer ownership
    function transferOwnership(uint256 parcelId, address newOwner) external onlyOfficer {
        require(parcels[parcelId].exists, "No parcel");
        require(!parcels[parcelId].activeEncumbrance, "Encumbrance active");
        address prev = ownerships[parcelId].owner;
        ownerships[parcelId] = Ownership(newOwner, block.number, prev);
        emit OwnershipTransferred(parcelId, prev, newOwner);
    }

    // Create allocation program
    function createAllocation(uint256 programId, uint256[] calldata parcelIds) external onlyOfficer {
        require(!programs[programId].exists, "Program exists");
        programs[programId] = AllocationProgram(programId, parcelIds, false, true);
        emit ProgramCreated(programId, parcelIds);
    }

    // Rename from "apply" → "applyForAllocation"
    function applyForAllocation(uint256 programId) external {
        require(programs[programId].exists, "No program");
        require(!programs[programId].closed, "Program closed");
        applications[programId].push(msg.sender);
        emit Applied(programId, msg.sender);
    }

    // Allocate
    function allocate(uint256 programId) external onlyOfficer {
        AllocationProgram storage p = programs[programId];
        require(p.exists, "No program");
        require(!p.closed, "Already allocated");

        address[] memory apps = applications[programId];
        uint256 slots = p.parcelIds.length;
        require(slots > 0, "No parcels");

        // Sort addresses
        for (uint256 i = 1; i < apps.length; i++) {
            address key = apps[i];
            uint256 j = i;
            while (j > 0 && apps[j - 1] > key) {
                apps[j] = apps[j - 1];
                j--;
            }
            apps[j] = key;
        }

        uint256 winCount = apps.length < slots ? apps.length : slots;
        address[] memory selected = new address[](winCount);
        for (uint256 k = 0; k < winCount; k++) {
            selected[k] = apps[k];
        }
        winners[programId] = selected;
        p.closed = true;
        emit Allocated(programId, selected);
    }

    // Views
    function getParcel(uint256 parcelId) external view returns (Parcel memory, Ownership memory) {
        return (parcels[parcelId], ownerships[parcelId]);
    }

    function getApplications(uint256 programId) external view returns (address[] memory) {
        return applications[programId];
    }

    function getWinners(uint256 programId) external view returns (address[] memory) {
        return winners[programId];
    }
}
