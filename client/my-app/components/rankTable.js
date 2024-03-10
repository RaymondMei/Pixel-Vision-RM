import React from "react";

function RankTable({ data }) {
  //assumes sorted list to display highest scores at top of list
  //displays list of players with their rank, username, and score
  const rows = data.map((item, index) => {
    return (
      <tr key={item.id}>
        <td className="text-white">{index + 1}</td>
        {index == 0 ? (
          <td className="text-white">
            {item.username}
            <span className="badge bg-warning">1st</span>
          </td>
        ) : index == 1 ? (
          <td className="text-white">
            {item.username}
            <span className="badge bg-secondary">2st</span>
          </td>
        ) : index == 2 ? (
          <td className="text-white">
            {item.username}
            <span className="badge bg-danger">3rd</span>
          </td>
        ) : (
          <td className="text-white">{item.username}</td>
        )}
        <td className="text-white">{item.score}</td>
      </tr>
    );
  });

  return (
    <table className="table table-hover table-dark table-responsive caption-top w-50 text-center">
      <caption>
        <h1 className="text-white">Players</h1>
      </caption>
      <thead>
        <tr>
          <th className="text-white">Rank</th>
          <th className="text-white">Username</th>
          <th className="text-white">Score</th>
        </tr>
      </thead>
      <tbody className="table-group-divider table-divider-color">{rows}</tbody>
    </table>
  );
}
export default RankTable;
