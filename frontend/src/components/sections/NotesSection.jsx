import { useState } from "react";
import SectionCard from "../ui/SectionsCard";

import {
  FileTextOutlined,
  LinkOutlined,
  PlusOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import { Button, Input, Tooltip } from "antd";

const { TextArea } = Input;

export default function NotesSection({
  notes,
  links,
  onNotesChange,
  onLinksChange,
}) {
  const [linkInput, setLinkInput] = useState("");

  const linkList = links
    ? links
        .split("\n")
        .map((link) => link.trim())
        .filter(Boolean)
    : [];

  const addLink = () => {
    const trimmedLink = linkInput.trim();

    if (!trimmedLink) return;

    const newLinks = [...linkList, trimmedLink].join("\n");

    onLinksChange(newLinks);
    setLinkInput("");
  };

  const removeLink = (index) => {
    const newLinks = linkList.filter((_, i) => i !== index).join("\n");

    onLinksChange(newLinks);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addLink();
    }
  };

  return (
    <SectionCard
      number={7}
      title="Additional Notes"
      description="Any extra context, references, or information for your manager"
      icon={<FileTextOutlined className="text-base text-slate-400" />}
    >
      <div className="space-y-5">
        <div>
          <label
            htmlFor="notes"
            className="mb-1.5 block text-xs font-medium text-slate-600"
          >
            Notes <span className="font-normal text-slate-400">(optional)</span>
          </label>

          <TextArea
            id="notes"
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
            placeholder="Add any additional context, ideas, or feedback..."
            rows={4}
            maxLength={2000}
            showCount
            className="!resize-none"
          />

          <p className="mt-1.5 text-xs text-slate-400">
            {notes.length} characters
          </p>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <LinkOutlined className="text-slate-400" />

            <span>Links</span>

            <span className="font-normal text-slate-400">(optional)</span>
          </label>

          <div className="flex gap-2">
            <Input
              type="url"
              value={linkInput}
              onChange={(event) => setLinkInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://..."
              className="flex-1"
            />

            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={addLink}
              disabled={!linkInput.trim()}
              className="!flex !items-center !gap-1"
            >
              Add
            </Button>
          </div>

          {linkList.length > 0 && (
            <ul className="mt-3 space-y-2">
              {linkList.map((link, index) => (
                <li
                  key={`${link}-${index}`}
                  className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2"
                >
                  <LinkOutlined className="shrink-0 text-sm text-slate-400" />

                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link}
                    className="min-w-0 flex-1 truncate text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {link}
                  </a>

                  <Tooltip title="Remove link">
                    <Button
                      type="text"
                      size="small"
                      icon={<CloseOutlined />}
                      onClick={() => removeLink(index)}
                      className="!flex !shrink-0 !items-center !justify-center !text-slate-400 hover:!bg-red-50 hover:!text-red-600"
                    />
                  </Tooltip>
                </li>
              ))}
            </ul>
          )}

          {linkList.length === 0 && (
            <p className="mt-2 text-xs text-slate-400">
              Add relevant documents, tickets, repositories, or other
              references.
            </p>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
