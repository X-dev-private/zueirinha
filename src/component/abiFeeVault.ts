// ABI do contrato FeeVault (verificado na Sepolia)
// https://sepolia.etherscan.io/address/0xEca4543ef3933746faBb4e4E9f0b221b9CEBf0a4#code
export const ABI_FEE_VAULT = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_feeBps',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'BetNotJoined',
    type: 'error',
  },
  {
    inputs: [],
    name: 'BetNotOpen',
    type: 'error',
  },
  {
    inputs: [],
    name: 'BetNotResolved',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CannotJoinOwnBet',
    type: 'error',
  },
  {
    inputs: [],
    name: 'FeeTooHigh',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InsufficientBalance',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotBetCreator',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotBetWinner',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotOwner',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Reentrancy',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ReturnTooHigh',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TooEarly',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TransferFailed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ZeroAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ZeroAmount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'betId',
        type: 'uint256',
      },
    ],
    name: 'BetCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'betId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'enum FeeVault.Side',
        name: 'side',
        type: 'uint8',
      },
    ],
    name: 'BetCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'betId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'opponent',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'resolveBlock',
        type: 'uint256',
      },
    ],
    name: 'BetJoined',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'betId',
        type: 'uint256',
      },
    ],
    name: 'BetRefunded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'betId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'enum FeeVault.Side',
        name: 'result',
        type: 'uint8',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'winner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'prize',
        type: 'uint256',
      },
    ],
    name: 'BetResolved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'credited',
        type: 'uint256',
      },
    ],
    name: 'Deposited',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldFeeBps',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newFeeBps',
        type: 'uint256',
      },
    ],
    name: 'FeeUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'FeesWithdrawn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'betId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'winner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'loser',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'ReturnedToLoser',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Withdrawn',
    type: 'event',
  },
  {
    inputs: [],
    name: 'BPS_DENOMINATOR',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_FEE_BPS',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'RESOLVE_WINDOW',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'bets',
    outputs: [
      {
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'opponent',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'enum FeeVault.Side',
        name: 'creatorSide',
        type: 'uint8',
      },
      {
        internalType: 'enum FeeVault.BetStatus',
        name: 'status',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'resolveBlock',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'winner',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'returned',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'betId',
        type: 'uint256',
      },
    ],
    name: 'cancelBet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'collectedFees',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'enum FeeVault.Side',
        name: 'side',
        type: 'uint8',
      },
    ],
    name: 'createBet',
    outputs: [
      {
        internalType: 'uint256',
        name: 'betId',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeBps',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'betId',
        type: 'uint256',
      },
    ],
    name: 'joinBet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nextBetId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'betId',
        type: 'uint256',
      },
    ],
    name: 'resolveBet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'betId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'returnToLoser',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newFeeBps',
        type: 'uint256',
      },
    ],
    name: 'setFeeBps',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'withdrawFees',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
] as const
