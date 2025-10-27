# Token-2022 Batch Instruction

This document describes the new `Batch` instruction that has been added to token-2022 to help avoid overhead when making Cross Program Invocations (CPI).

## Overview

The `Batch` instruction allows you to execute multiple token operations in a single instruction, which is particularly useful when you need to perform several token operations from within a CPI context. This avoids the overhead of multiple individual CPI calls.

## Features

- **Sequential Execution**: Instructions are executed in the order they appear in the batch
- **Ownership Validation**: All account ownership checks are performed for each inner instruction
- **Spoofing Protection**: Explicit validation prevents spoofing attacks
- **Size Limits**: Batches are limited to 16 instructions to prevent excessive compute usage

## Supported Instructions

The batch instruction can contain any valid token instruction, including:

- `Transfer` / `TransferChecked`
- `Approve` / `ApproveChecked`  
- `MintTo` / `MintToChecked`
- `Burn` / `BurnChecked`
- `Revoke`
- `SetAuthority`
- And others

## Usage Example

```rust
use spl_token_2022_interface::{
    instruction::{TokenInstruction, batch, transfer_checked, approve},
};
use solana_pubkey::Pubkey;

// Create individual instructions
let transfer = TokenInstruction::TransferChecked {
    amount: 100,
    decimals: 6,
};

let approve = TokenInstruction::Approve {
    amount: 50,
};

// Create a batch instruction
let batch_instruction = TokenInstruction::Batch {
    instructions: vec![transfer, approve],
};

// Or use the helper function
let instruction = batch(
    &token_program_id,
    vec![transfer, approve]
)?;
```

## Account Management

When using batch instructions, you need to provide all accounts required by the inner instructions. The batch instruction doesn't automatically determine which accounts are needed - you must manually include all required accounts in the correct order.

## Error Handling

- If any instruction in the batch fails, the entire batch fails
- Empty batches are not allowed
- Batches with more than 16 instructions are rejected
- Invalid instruction data will cause the batch to fail

## Implementation Details

### Instruction Format

The batch instruction is serialized as:
1. Instruction discriminator (45)
2. Number of instructions (1 byte, max 255)
3. For each instruction:
   - Instruction length (2 bytes, little-endian)
   - Instruction data (variable length)

### Processing

The batch processor:
1. Validates the batch structure
2. Checks batch size limits
3. Executes each instruction sequentially
4. Performs all standard ownership and authority checks
5. Maintains the same security guarantees as individual instructions

## Security Considerations

The batch instruction maintains the same security properties as individual instructions:

- All account ownership is validated
- Authority signatures are required
- CPI Guard restrictions are respected
- Extension-specific validations are performed

This prevents any potential spoofing attacks while providing the performance benefits of batched execution.