import {
  PlusOutlined,
  DeleteOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import { Award } from "lucide-react";

import { Button, Input, Radio, Tag, Tooltip } from "antd";
import SectionCard from "../ui/SectionsCard";
const { TextArea } = Input;
export default function AchievementsSection({
  achievements,
  onAdd,
  onDelete,
  onFieldChange,
  onKeyAchievementChange,
}) {
  return (
    <SectionCard
      number={5}
      title="Achievements / Highlights"
      description="Celebrate wins and notable accomplishments from this week"
      icon={<Award className="text-base text-slate-400" />}
      actions={
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={onAdd}
          className="!flex !items-center !gap-1"
        >
          {" "}
          Add Achievement{" "}
        </Button>
      }
    >
      {" "}
      {achievements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          {" "}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-3">
            {" "}
            <Award className="text-2xl text-slate-300" />{" "}
          </div>{" "}
          <p className="text-sm font-medium text-slate-600">
            {" "}
            No achievements added yet{" "}
          </p>{" "}
          <p className="mt-1 text-xs text-slate-400">
            {" "}
            Share your wins and highlights from this week{" "}
          </p>{" "}
        </div>
      ) : (
        <div className="space-y-3">
          {" "}
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
            {" "}
            <StarFilled className="text-amber-500" />{" "}
            <span>
              {" "}
              Mark one achievement as the{" "}
              <strong className="font-semibold"> Key Achievement </strong> to
              spotlight your biggest win.{" "}
            </span>{" "}
          </div>{" "}
          {achievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className={`rounded-lg border p-4 transition-all ${achievement.isKeyAchievement ? "border-green-300 bg-green-50/30 ring-1 ring-green-200" : "border-slate-200 hover:border-slate-300"}`}
            >
              {" "}
              <div className="mb-3 flex items-center justify-between">
                {" "}
                <div className="flex items-center gap-2">
                  {" "}
                  <span className="text-xs font-semibold text-slate-400">
                    {" "}
                    Achievement {index + 1}{" "}
                  </span>{" "}
                  {achievement.isKeyAchievement && (
                    <Tag
                      color="success"
                      icon={<StarFilled />}
                      className="!m-0 !flex !items-center !gap-1 !rounded-full !text-[10px] !font-semibold !uppercase"
                    >
                      {" "}
                      Key Achievement{" "}
                    </Tag>
                  )}{" "}
                </div>{" "}
                <Tooltip title="Remove achievement">
                  {" "}
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => onDelete(achievement.id)}
                    className="!flex !items-center !justify-center"
                  />{" "}
                </Tooltip>{" "}
              </div>{" "}
              <div className="space-y-4">
                {" "}
                <div>
                  {" "}
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    {" "}
                    Description{" "}
                  </label>{" "}
                  <TextArea
                    value={achievement.description}
                    onChange={(event) =>
                      onFieldChange(
                        achievement.id,
                        "description",
                        event.target.value,
                      )
                    }
                    placeholder="What did you accomplish this week?"
                    rows={3}
                    maxLength={1000}
                    showCount
                    className="!resize-none"
                  />{" "}
                </div>{" "}
                <Radio
                  checked={achievement.isKeyAchievement}
                  onChange={() => onKeyAchievementChange(achievement.id)}
                  className="!text-sm !text-slate-600"
                >
                  {" "}
                  <span className="inline-flex items-center gap-1.5">
                    {" "}
                    {achievement.isKeyAchievement ? (
                      <StarFilled className="text-green-500" />
                    ) : (
                      <StarOutlined className="text-slate-400" />
                    )}{" "}
                    <span> Mark as Key Achievement </span>{" "}
                  </span>{" "}
                </Radio>{" "}
              </div>{" "}
            </div>
          ))}{" "}
        </div>
      )}{" "}
    </SectionCard>
  );
}
