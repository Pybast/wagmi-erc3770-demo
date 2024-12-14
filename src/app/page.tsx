"use client";

import {
  type BaseError,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useAccount,
  useConnect,
  useDisconnect,
} from "wagmi";
import { parseEther } from "viem";

function App() {
  const account = useAccount();
  const { connectors, connect, status, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();

  const {
    data: hash,
    error: sendTxError,
    isPending,
    sendTransaction,
  } = useSendTransaction();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const to = formData.get("address") as `0x${string}`;
    const value = formData.get("value") as string;
    sendTransaction({ to, value: parseEther(value) });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <>
      <div>
        <h1>Demo</h1>

        <div>chainId: {account.chainId}</div>

        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      {account.status !== "connected" && (
        <div>
          <h3>Connect</h3>
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              type="button"
              style={{ marginRight: "12px" }}
            >
              {connector.name}
            </button>
          ))}
          {/* <div>{status}</div> */}
          <div>{connectError?.message}</div>
        </div>
      )}

      <br />
      <br />

      <div>
        <div>Enter the address you want to send 0.001 ETH to</div>
        <div style={{ color: "grey", fontSize: "14px" }}>
          Do not forget to make it address specific
        </div>
        <form onSubmit={submit}>
          <input
            name="address"
            placeholder="eth:0xA0Cf…251e"
            required
            style={{ width: "350px" }}
          />
          <input name="value" placeholder="0.05" required />
          <button disabled={isPending} type="submit">
            {isPending ? "Confirming..." : "Send"}
          </button>
          {hash && <div>Transaction Hash: {hash}</div>}
          {isConfirming && <div>Waiting for confirmation...</div>}
          {isConfirmed && <div>Transaction confirmed.</div>}
          {sendTxError && (
            <div>
              Error:{" "}
              {(sendTxError as BaseError).shortMessage || sendTxError.message}
            </div>
          )}
        </form>
      </div>
    </>
  );
}

export default App;
