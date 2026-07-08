import type { ModelGraph } from "@mc/okf";
import { f, mart, rel, type Template } from "./helpers";

// Public-dataset templates (kept schema-faithful to the real BigQuery tables).

const graph: ModelGraph = {
  storageId: null,
  nodes: [
    mart("blocks", "Blocks", "TABLE", [
      f("hash", "STRING", true, "Block header hash that uniquely identifies the block."),
      f("number", "INTEGER", false, "Block height (sequential index in the chain)."),
      f("size", "INTEGER", false, "Serialized block size in bytes."),
      f("weight", "INTEGER", false, "Block weight as defined by BIP 141."),
      f("version", "INTEGER", false, "Block version indicating which validation rules to follow."),
      f("merkle_root", "STRING", false, "Merkle tree root hash of all transactions in the block."),
      f("timestamp", "TIMESTAMP", false, "Time the miner started hashing the block header."),
      f("nonce", "STRING", false, "Value miners vary to satisfy the proof-of-work difficulty target."),
      f("bits", "STRING", false, "Compact encoding of the proof-of-work difficulty target."),
      f("transaction_count", "INTEGER", false, "Number of transactions included in the block."),
    ], "Bitcoin blocks: one row per mined block with header and summary fields."),
    mart("transactions", "Transactions", "TABLE", [
      f("hash", "STRING", true, "Transaction hash (txid) that uniquely identifies the transaction."),
      f("size", "INTEGER", false, "Serialized transaction size in bytes."),
      f("virtual_size", "INTEGER", false, "Virtual transaction size in virtual bytes (SegWit-weighted)."),
      f("version", "INTEGER", false, "Transaction format version number."),
      f("lock_time", "INTEGER", false, "Earliest block height or time at which the transaction may be added."),
      f("block_hash", "STRING", false, "Hash of the block containing this transaction."),
      f("block_number", "INTEGER", false, "Height of the block containing this transaction."),
      f("block_timestamp", "TIMESTAMP", false, "Timestamp of the block containing this transaction."),
      f("input_count", "INTEGER", false, "Number of inputs in the transaction."),
      f("output_count", "INTEGER", false, "Number of outputs in the transaction."),
      f("input_value", "NUMERIC", false, "Total value of all inputs in BTC."),
      f("output_value", "NUMERIC", false, "Total value of all outputs in BTC."),
      f("is_coinbase", "BOOLEAN", false, "Whether this is a coinbase (block reward) transaction."),
      f("fee", "NUMERIC", false, "Transaction fee paid to the miner in BTC."),
    ], "Bitcoin transactions: one row per transaction with value and fee details."),
    mart("inputs", "Inputs", "TABLE", [
      f("transaction_hash", "STRING", false, "Hash of the transaction this input belongs to."),
      f("block_hash", "STRING", false, "Hash of the block containing this input."),
      f("block_number", "INTEGER", false, "Height of the block containing this input."),
      f("block_timestamp", "TIMESTAMP", false, "Timestamp of the block containing this input."),
      f("index", "INTEGER", true, "Zero-based position of this input within the transaction."),
      f("spent_transaction_hash", "STRING", false, "Hash of the transaction whose output is being spent."),
      f("spent_output_index", "INTEGER", false, "Output index in the prior transaction being spent."),
      f("script_asm", "STRING", false, "Unlocking script (scriptSig) in human-readable assembly."),
      f("sequence", "INTEGER", false, "Input sequence number used for relative locktime/RBF."),
      f("type", "STRING", false, "Type of the spent output script (e.g. pubkeyhash)."),
      f("value", "NUMERIC", false, "Value of the spent output in BTC."),
    ], "Bitcoin transaction inputs: one row per input referencing a spent output."),
    mart("outputs", "Outputs", "TABLE", [
      f("transaction_hash", "STRING", false, "Hash of the transaction this output belongs to."),
      f("block_hash", "STRING", false, "Hash of the block containing this output."),
      f("block_number", "INTEGER", false, "Height of the block containing this output."),
      f("block_timestamp", "TIMESTAMP", false, "Timestamp of the block containing this output."),
      f("index", "INTEGER", true, "Zero-based position of this output within the transaction."),
      f("script_asm", "STRING", false, "Locking script (scriptPubKey) in human-readable assembly."),
      f("type", "STRING", false, "Type of the output script (e.g. pubkeyhash, scripthash)."),
      f("value", "NUMERIC", false, "Value of the output in BTC."),
    ], "Bitcoin transaction outputs: one row per output with value and script."),
  ],
  edges: [
    rel("e1", "transactions", "blocks", "block_hash", "hash"),
    rel("e2", "inputs", "transactions", "transaction_hash", "hash"),
    rel("e3", "outputs", "transactions", "transaction_hash", "hash"),
  ],
};

export const crypto_bitcoin: Template = {
  id: "crypto_bitcoin",
  nicheId: null,
  category: "dataset",
  name: "Bitcoin (crypto)",
  description: "Blocks, transactions, inputs and outputs from the public Bitcoin BigQuery dataset.",
  graph,
};
