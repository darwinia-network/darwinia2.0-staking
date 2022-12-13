import { Button, Column, Table, Tooltip, TableRow } from "@darwinia/ui";
import { localeKeys, useAppTranslation } from "@package/app-locale";
import { useWallet } from "@darwinia/app-wallet";
import JazzIcon from "../JazzIcon";
import warningIcon from "../../assets/images/warning.svg";
import plusIcon from "../../assets/images/plus-square.svg";
import minusIcon from "../../assets/images/minus-square.svg";
import helpIcon from "../../assets/images/help.svg";

interface Bond {
  amount: string;
  symbol: string;
  isDeposit: boolean;
}

interface Delegation extends TableRow {
  collator?: string;
  previousReward?: string;
  staked: string;
  bondedTokens: Bond[];
  isActive?: boolean;
  isMigrated?: boolean;
}

const StakingRecordsTable = () => {
  const { t } = useAppTranslation();
  const { selectedNetwork } = useWallet();

  const dataSource: Delegation[] = [
    {
      id: "1",
      collator: "chchainkoney.com",
      previousReward: "0/0",
      staked: "9,863",
      bondedTokens: [
        {
          amount: "12,983",
          symbol: selectedNetwork?.ring.symbol ?? "",
          isDeposit: false,
        },
        {
          amount: "10,000",
          symbol: selectedNetwork?.ring.symbol ?? "",
          isDeposit: true,
        },
        {
          amount: "9,899",
          symbol: selectedNetwork?.kton.symbol ?? "",
          isDeposit: false,
        },
      ],
      isMigrated: true,
    },
    {
      id: "2",
      collator: "chchainkoney.com",
      previousReward: "0/0",
      staked: "9,863",
      isActive: true,
      bondedTokens: [
        {
          amount: "12,983",
          symbol: selectedNetwork?.ring.symbol ?? "",
          isDeposit: false,
        },
        {
          amount: "10,000",
          symbol: selectedNetwork?.ring.symbol ?? "",
          isDeposit: true,
        },
        {
          amount: "9,899",
          symbol: selectedNetwork?.kton.symbol ?? "",
          isDeposit: false,
        },
      ],
    },
    {
      id: "3",
      collator: "chchainkoney.com",
      previousReward: "0/0",
      staked: "9,863",
      bondedTokens: [
        {
          amount: "12,983",
          symbol: selectedNetwork?.ring.symbol ?? "",
          isDeposit: false,
        },
        {
          amount: "10,000",
          symbol: selectedNetwork?.ring.symbol ?? "",
          isDeposit: true,
        },
        {
          amount: "9,899",
          symbol: selectedNetwork?.kton.symbol ?? "",
          isDeposit: false,
        },
      ],
    },
    {
      id: "4",
      collator: "chchainkoney.com",
      previousReward: "0/0",
      staked: "9,863",
      isActive: false,
      bondedTokens: [
        {
          amount: "12,983",
          symbol: selectedNetwork?.ring.symbol ?? "",
          isDeposit: false,
        },
        {
          amount: "10,000",
          symbol: selectedNetwork?.ring.symbol ?? "",
          isDeposit: true,
        },
        {
          amount: "9,899",
          symbol: selectedNetwork?.kton.symbol ?? "",
          isDeposit: false,
        },
      ],
    },
  ];

  const columns: Column<Delegation>[] = [
    {
      id: "1",
      title: <div>Collator</div>,
      key: "collator",
      render: (row) => {
        if (row.isMigrated) {
          return (
            <Button btnType={"secondary"} className={"!px-[15px] !h-[30px]"}>
              {t(localeKeys.selectCollator)}
            </Button>
          );
        }
        return (
          <div className={"flex gap-[5px] items-center"}>
            <JazzIcon size={30} address={row.collator ?? ""} />
            <div>{row.collator}</div>
            {row.isActive ? null : (
              <Tooltip message={t(localeKeys.waitingCollatorWarning)}>
                <img className={"w-[21px]"} src={warningIcon} alt="image" />
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      id: "2",
      title: <div>Your rewards last session / in total</div>,
      key: "previousReward",
      width: "200px",
    },
    {
      id: "3",
      title: <div>You staked (Power)</div>,
      key: "staked",
      width: "150px",
      render: (row) => {
        if (row.isMigrated) {
          return (
            <div className={"flex items-center gap-[10px]"}>
              <div className={"text-halfWhite"}>{row.staked}</div>
              <Tooltip message={t(localeKeys.powerNotWorking)}>
                <img className={"w-[20px]"} src={helpIcon} alt="image" />
              </Tooltip>
            </div>
          );
        }

        return <div>{row.staked}</div>;
      },
    },
    {
      id: "4",
      title: <div>Your Bonded Tokens</div>,
      key: "bondedTokens",
      render: (row) => {
        return (
          <div>
            {row.bondedTokens.map((item, index) => {
              return (
                <div className={"flex gap-[5px]"} key={`${row.collator}-${index}`}>
                  <div>
                    {item.amount} {item.isDeposit ? t(localeKeys.deposit) : ""} {item.symbol.toUpperCase()}
                  </div>
                  {row.isMigrated ? null : (
                    <div className={"flex gap-[5px]"}>
                      <img src={plusIcon} className={"clickable w-[16px]"} alt="image" />
                      <img src={minusIcon} className={"clickable w-[16px]"} alt="image" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      id: "5",
      title: <div />,
      key: "collator",
      width: "250px",
      render: (row) => {
        if (row.isMigrated) {
          return (
            <Button btnType={"secondary"} className={"!px-[15px] !h-[30px]"}>
              {t(localeKeys.unbondAll)}
            </Button>
          );
        }
        return (
          <div className={"flex gap-[10px]"}>
            <Button className={"!h-[36px] !px-[15px]"} btnType={"secondary"}>
              Commission
            </Button>
            <Button className={"!h-[36px] !px-[15px]"} btnType={"secondary"}>
              ...
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <div className={"flex flex-col"}>
      <div className={"flex flex-col mt-[20px]"}>
        <Table noDataText={t(localeKeys.noDelegations)} dataSource={dataSource} columns={columns} />
      </div>
    </div>
  );
};

export default StakingRecordsTable;
