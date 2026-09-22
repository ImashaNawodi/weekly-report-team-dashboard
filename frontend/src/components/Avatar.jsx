function getInitials(firstName = "", lastName = "") {
  const first = firstName.trim();
  const last = lastName.trim();

  if (first && last) {
    return (first[0] + last[0]).toUpperCase();
  }

  return first.slice(0, 2).toUpperCase();
}

export default function AvatarGroup({ members = [] }) {
  const memberList = Array.isArray(members) ? members : [members];

  return (
    <div className="flex items-center gap-1">
      {console.log("memberList", memberList)}
      {memberList.slice(0, 4).map((member, index) => (
        <div key={member.userID || member.id || index}>
          <div
            className="flex h-8 w-8 min-w-8 items-center justify-center rounded-full text-[11px] font-semibold text-white"
            style={{
              backgroundColor:
                member.profileColor
            }}
          >
            {console.log("member", member)}
            {getInitials(member.firstName, member.lastName)}
          </div>
        </div>
      ))}

      {memberList.length > 4 && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-semibold text-slate-600">
          +{memberList.length - 4}
        </div>
      )}
    </div>
  );
}