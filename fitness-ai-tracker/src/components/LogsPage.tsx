import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../app/hooks";
import { RootState } from "../app/store";
import {
  EnhancementLog,
  updateLog,
  selectLogs,
} from "../features/logs/logsSlice";
import { ButtonEdit } from "./utilsCalls/buttonEdit";

type EditingTarget =
  | { id: number; field: keyof Omit<EnhancementLog, "id" | "date"> }
  | null;

type Props = {
  isOpenlog: boolean;
  setIsOpenlog: (value: boolean) => void;
};

export const LogsPage: FC<Props> = ({ isOpenlog, setIsOpenlog }) => {
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user);
  const logs = useSelector(selectLogs); // <– not strictly needed but kept
  const [editingTarget, setEditingTarget] = useState<EditingTarget>(null);

  const onSave = (
    id: number,
    field: keyof Omit<EnhancementLog, "id" | "date">,
    value: string | number
  ) => {
    dispatch(updateLog({ id, updates: { [field]: value } }));
  };

  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (!isOpenlog) return null;

  return (
    <div>
      <h2>{`Edit Your logs ${user?.user?.name || ""}`}</h2>
      <ul>
        {user.user?.enchancementLog.map((log) => {
          const fields: Array<
            keyof Omit<EnhancementLog, "id" | "date">
          > = ["compound", "dose", "time", "goal"];

          return (
            <li key={log.id}>
              {fields.map((field) => (
                <>
                <ButtonEdit
                  key={field}
                  log={log}
                  field={field}
                  editingTarget={editingTarget}
                  setEditingTarget={setEditingTarget}
                  onSave={onSave}
                />
                <br></br>
                </>
              ))}
              
              {`logged at ${formatter.format(log.date)}`}
            </li>
          );
        })}
      </ul>

      <button onClick={() => setIsOpenlog(false)}>Close</button>
    </div>
  );
};
