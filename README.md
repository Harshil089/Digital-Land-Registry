# LandChain - Blockchain Land Registry System

A modern, blockchain-based land registry system with a beautiful React GUI for transparent land ownership tracking and management.

## Features

### 🏗️ **Smart Contract Features**
- **Land Parcel Management**: Create, track, and manage land parcels with unique IDs
- **Role-Based Access Control**: Admin, Officer, Bank, and User roles with specific permissions
- **Ownership Tracking**: Transparent ownership transfer with blockchain verification
- **Encumbrance System**: Bank officers can set encumbrances on parcels for loan security
- **Allocation Programs**: Create and manage land allocation programs with fair selection

### 🎨 **Modern GUI Features**
- **Responsive Design**: Beautiful, mobile-friendly interface built with React and Tailwind CSS
- **Real-time Blockchain Integration**: Connect MetaMask wallet for live blockchain interaction
- **Member Management**: Track past and new members with comprehensive activity history
- **Visual Flow Control**: Step-by-step visualization of system processes for better understanding
- **Demo Data Display**: Rich demo data showcasing all smart contract attributes
- **Search & Filtering**: Advanced search and filtering capabilities across all data

### 🔐 **Security & Transparency**
- **Blockchain Verification**: All transactions are recorded on the Ethereum blockchain
- **Immutable Records**: Land ownership and transaction history cannot be tampered with
- **Audit Trail**: Complete transaction history with timestamps and block numbers
- **Role-Based Permissions**: Secure access control based on user roles

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │   Web3 Provider │    │  Smart Contract │
│                 │    │                 │    │                 │
│ • Dashboard     │◄──►│ • MetaMask      │◄──►│ • LandRegistry  │
│ • Parcels      │    │ • Contract      │    │ • Role Mgmt     │
│ • Members      │    │ • Transactions  │    │ • Parcel Mgmt   │
│ • Programs     │    │                 │    │ • Allocation    │
│ • Transactions │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MetaMask browser extension
- Git

### 1. Clone and Install
```bash
git clone <repository-url>
cd landchain
npm install
```

### 2. Compile Smart Contracts
```bash
npm run compile
```

### 3. Deploy to Local Network
```bash
# Start local Hardhat network
npx hardhat node

# In another terminal, deploy contracts
npm run deploy
```

### 4. Run Demo Script (Optional)
```bash
npm run demo
```

### 5. Start the GUI
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## Usage Guide

### 🔌 **Connecting Wallet**
1. Click "Connect Wallet" in the top-right corner
2. Approve MetaMask connection
3. Ensure you're connected to the correct network (localhost:8545 for development)

### 📊 **Dashboard**
- **Overview Statistics**: Total parcels, members, programs, and transactions
- **Flow Control Visualization**: Step-by-step system process overview
- **Recent Activity**: Latest parcels and member updates
- **Connection Status**: Wallet connection indicator

### 🏞️ **Parcels Management**
- View all land parcels with detailed information
- Filter by status (active/blocked) and search by location/land use
- See parcel details including:
  - Area, location code, and land use type
  - Current and previous owners
  - Encumbrance status
  - Geo-hash and block information

### 👥 **Members Management**
- **Add New Members**: Register new users with roles and contact information
- **Role Management**: Assign admin, officer, bank, or user roles
- **Activity Tracking**: View complete member activity history
- **Status Management**: Activate/deactivate members as needed

### 📅 **Allocation Programs**
- View land allocation programs and their status
- See applicant lists and winner selection
- Track program creation and completion
- Monitor parcel assignments

### 📝 **Transaction History**
- Complete blockchain transaction log
- Filter by transaction type and status
- View gas usage, block numbers, and timestamps
- Search by transaction hash or details

## Smart Contract Functions

### Role Management
- `setOfficer(address, bool)`: Assign officer role
- `setBankOrOfficer(address, bool)`: Assign bank/officer role

### Parcel Management
- `createParcel(id, geoHash, area, location, landUse, owner)`: Create new parcel
- `transferOwnership(parcelId, newOwner)`: Transfer parcel ownership
- `setEncumbrance(parcelId, flag)`: Set/remove encumbrance

### Allocation Programs
- `createAllocation(programId, parcelIds)`: Create allocation program
- `applyForAllocation(programId)`: Apply for program
- `allocate(programId)`: Complete allocation and select winners

## Demo Data

The system includes comprehensive demo data showcasing:
- **3 Land Parcels**: Different sizes, locations, and land uses
- **5 System Members**: Various roles and activity levels
- **1 Allocation Program**: Complete lifecycle from creation to completion
- **8 Transactions**: All major system operations

## Development

### Project Structure
```
landchain/
├── contracts/          # Smart contracts
├── src/               # React frontend
│   ├── components/    # Reusable UI components
│   ├── contexts/      # React contexts (Web3, Members)
│   ├── pages/         # Main application pages
│   └── main.jsx       # Application entry point
├── scripts/           # Deployment and demo scripts
├── test/              # Smart contract tests
└── hardhat.config.js  # Hardhat configuration
```

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run compile`: Compile smart contracts
- `npm run deploy`: Deploy to local network
- `npm run demo`: Run demo script

### Customization
- **Styling**: Modify `tailwind.config.js` for theme changes
- **Smart Contract**: Update `contracts/LandRegistry.sol` for business logic
- **Demo Data**: Modify context files for different demo scenarios

## Network Configuration

### Development (Local)
- Network: Localhost
- Chain ID: 31337
- RPC URL: http://127.0.0.1:8545
- Currency: ETH

### Production
Update `hardhat.config.js` and `Web3Context.jsx` with your production network details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
- Check the documentation
- Review the smart contract code
- Open an issue on GitHub

---

**LandChain** - Building the future of transparent land ownership on the blockchain 🌍🏠
