import colors from "../helpers/BackgroundColor";

function getInitials(name) {
  const parts = name.trim().split(/\s+/);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}

export default function AvatarGroup({ members = [] }) {
  return (
   <div className="flex items-center gap-1">
  {members.slice(0, 4).map((member, index) => (
    <div key={member.id}>
      <div
        className={`flex h-8 w-8 min-w-8 items-center justify-center rounded-full ${
          colors[index % colors.length]
        } text-[11px] font-semibold text-white`}
      >
        {getInitials(member.firstName, member.lastName)}
      </div>
    </div>
  ))}

  {members.length > 4 && (
    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-semibold text-slate-600">
      +{members.length - 4}
    </div>
  )}
</div>
  );
}
