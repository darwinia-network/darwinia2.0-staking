import { Key, useCallback, useMemo, useState } from "react";
import Modal from "./modal";
import CheckboxGroup from "./checkbox-group";
import { commissionWeightedPower, formatBlanace, getChainConfig, notifyTransaction } from "@/utils";
import { ExtraPower } from "./balance-input";
import { useApp, useStaking } from "@/hooks";
import { notification } from "./notification";
import { writeContract, waitForTransaction } from "@wagmi/core";
import { ChainID } from "@/types";

export default function UnbondDepositModal({
  commission,
  isOpen,
  onClose = () => undefined,
}: {
  commission: string;
  isOpen: boolean;
  onClose?: () => void;
}) {
  const { deposits, stakedDeposits, calcExtraPower } = useStaking();
  const { activeChain } = useApp();

  const [checkedDeposits, setCheckedDeposits] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);

  const extraPower = useMemo(
    () =>
      commissionWeightedPower(
        calcExtraPower(
          deposits.filter(({ id }) => checkedDeposits.includes(id)).reduce((acc, cur) => acc + cur.value, 0n),
          0n
        ),
        commission
      ),
    [deposits, commission, checkedDeposits, calcExtraPower]
  );

  const availableDeposits = deposits.filter(({ id }) => stakedDeposits.includes(id));
  const { nativeToken } = getChainConfig(activeChain);

  const handleUnbond = useCallback(async () => {
    setBusy(true);
    const { contract, explorer } = getChainConfig(activeChain);

    try {
      const abi =
        activeChain === ChainID.CRAB
          ? (await import("@/config/abi/staking-v2.json")).default
          : (await import(`@/config/abi/${contract.staking.abiFile}`)).default;

      const { hash } = await writeContract({
        address: contract.staking.address,
        abi,
        functionName: "unstake",
        args: [0n, 0n, checkedDeposits],
      });
      const receipt = await waitForTransaction({ hash });

      if (receipt.status === "success") {
        setCheckedDeposits([]);
        onClose();
      }
      notifyTransaction(receipt, explorer);
    } catch (err) {
      console.error(err);
      notification.error({ description: (err as Error).message });
    }

    setBusy(false);
  }, [activeChain, checkedDeposits, onClose]);

  return (
    <Modal
      title="Unbond Deposits"
      isOpen={isOpen}
      maskClosable={false}
      okText="Unbond"
      onCancel={onClose}
      onClose={onClose}
      onOk={handleUnbond}
      className="lg:w-[25rem]"
      disabled={checkedDeposits.length <= 0}
      busy={busy}
    >
      {availableDeposits.length ? (
        <>
          <CheckboxGroup
            options={availableDeposits.map(({ id, value }) => ({
              value: id,
              label: (
                <div key={id} className="flex w-full items-center justify-between">
                  <span className="text-sm font-light text-white">{`ID#${id}`}</span>
                  <span className="text-sm font-light text-white">{`${formatBlanace(value, nativeToken.decimals, {
                    keepZero: false,
                  })} ${nativeToken.symbol}`}</span>
                </div>
              ),
            }))}
            checkedValues={checkedDeposits}
            onChange={setCheckedDeposits as (values: Key[]) => void}
            className="max-h-80 overflow-y-auto"
          />

          <div className="h-[1px] bg-white/20" />

          <ExtraPower power={extraPower} powerChanges="less" />
        </>
      ) : (
        <span className="text-xs font-light text-white">No deposits to unbond</span>
      )}
    </Modal>
  );
}
