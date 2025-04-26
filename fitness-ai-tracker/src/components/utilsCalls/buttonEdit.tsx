import { FC, useState, useEffect } from "react";
import { EnhancementLog } from "../../features/logs/logsSlice";

type EditingTarget =
  | { id: number; field: keyof Omit<EnhancementLog, "id" | "date"> }
  | null;

type Props = {
  log: EnhancementLog;
  field: keyof Omit<EnhancementLog, "id" | "date">;
  editingTarget: EditingTarget;
  setEditingTarget: (t: EditingTarget) => void;
  onSave: (
    id: number,
    field: keyof Omit<EnhancementLog, "id" | "date">,
    value: string | number
  ) => void;
};

export const ButtonEdit: FC<Props> = ({
  log,
  field,
  editingTarget,
  setEditingTarget,
  onSave,
}) => {
  const isEditing =
    editingTarget?.id === log.id && editingTarget.field === field;

  const [value, setValue] = useState<string | number>(log[field]);

  // keep local input in sync if edit mode flips without saving
  useEffect(() => {
    if (!isEditing) setValue(log[field]);
  }, [isEditing, log, field]);

  const label = field.charAt(0).toUpperCase() + field.slice(1);
  const inputType = typeof log[field] === "number" ? "number" : "text";

  return isEditing ? (
    <>
      <strong>{label}: </strong>
      <input
        type={inputType}
        value={value}
        onChange={(e) =>
          setValue(inputType === "number" ? Number(e.target.value) : e.target.value)
        }
        autoFocus
      />
      <button
        onClick={() => {
          onSave(log.id, field, value);
          setEditingTarget(null);
        }}
      >
        Save
      </button>
      <button onClick={() => setEditingTarget(null)}>Cancel</button>{" "}
    </>
  ) : (
    <>
      <strong>{label}:</strong> {log[field] ?? "N/A"}{" "}
      <button onClick={() => setEditingTarget({ id: log.id, field })}>
        Edit
      </button>{" "}
    </>
  );
};
