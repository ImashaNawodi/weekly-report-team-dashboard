import {
  SaveOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function ActionBar({ onSaveDraft, onPreview }) {
  const navigate = useNavigate();
  return (
    <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-sm lg:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
          <span>Unsaved changes — remember to save your progress</span>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/manager-home/reports")}
            className="!flex !items-center !gap-1"
          >
            <span className="hidden sm:inline">Back</span>
          </Button>

          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={onSaveDraft}
            className="!flex !items-center !gap-1 !bg-blue-600 hover:!bg-blue-700 !border-blue-600"
          >
            <span className="hidden sm:inline">Save Draft</span>
            <span className="sm:hidden">Save</span>
          </Button>

          <Button
            icon={<EyeOutlined />}
            onClick={onPreview}
            className="!flex !items-center !gap-1 !text-slate-600 !border-slate-300 hover:!text-blue-600 hover:!border-blue-400 hover:!bg-blue-50"
          >
            <span className="hidden sm:inline">Preview</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
