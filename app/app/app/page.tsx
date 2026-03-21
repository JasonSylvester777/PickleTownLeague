type LeaderboardTeam = {
  "Season ID": string;
  "League ID": string;
  "League Name": string;
  Rank: number;
  "Team ID": string;
  "Team Name": string;
  "Player 1": string;
  "Player 2": string;
  "Matches Played": number;
  Wins: number;
  Draws: number;
  Losses: number;
  Points: number;
  "Sets Won": number;
  "Sets Lost": number;
  "Table Status": string;
};

type LiveMatch = {
  fixtureId: string;
  leagueName: string;
  phase: string;
  date: string;
  startTime: string;
  court: string;
  teamAName: string;
  teamBName: string;
  score: {
    currentSet: number;
    currentSetScore: {
      teamA: number;
      teamB: number;
    };
    teamASetWins: number;
    teamBSetWins: number;
  };
};

type CompletedMatch = {
  fixtureId: string;
  leagueName: string;
  phase: string;
  date: string;
  startTime: string;
  court: string;
  teamAName: string;
  teamBName: string;
  teamASetsWon: number;
  teamBSetsWon: number;
  winnerTeamName: string;
  resultType: string;
};

type LeagueSection = {
  leagueId: string;
  leagueName: string;
  teams: LeaderboardTeam[];
};

type ApiResponse = {
  success: boolean;
  leagueName: string;
  season: string;
  liveMatches: LiveMatch[];
  completedMatches: CompletedMatch[];
  leagues: LeagueSection[];
};

const API_URL =
  "https://script.google.com/macros/s/AKfycbxEBZgTg-SHJuNJojv-wrMOT1WgisOY88zDKyXp-n155FTixR5OBeMGAnhUDlBGT8aJ/exec?action=getPublicLeaderboard";

async function getData(): Promise<ApiResponse | null> {
  try {
    const res = await fetch(API_URL, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch {
    return null;
  }
}

function statusClass(status: string) {
  if (status === "Direct to Grand Final") return "status-pill status-final";
  if (status === "Challenger Final Spot" || status === "Playoff Spot") {
    return "status-pill status-playoff";
  }
  return "status-pill";
}

export default async function Page() {
  const data = await getData();

  if (!data || !data.success) {
    return (
      <main className="page">
        <div className="hero">
          <h1>PickleTown @Betshalom PickleBall League</h1>
          <p>Unable to load leaderboard data.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="hero">
        <h1>{data.leagueName}</h1>
        <p>{data.season}</p>
      </section>

      <section className="section">
        <h2>Live Matches</h2>
        {data.liveMatches.length === 0 ? (
          <p className="empty">No live matches at the moment.</p>
        ) : (
          <div className="grid">
            {data.liveMatches.map((match) => (
              <div className="live-card" key={match.fixtureId}>
                <div className="live-top">
                  <div>
                    <strong>{match.leagueName}</strong>
                    <div className="small">
                      {match.phase} • {match.date} • {match.startTime} • {match.court}
                    </div>
                  </div>
                  <span className="badge badge-live">LIVE</span>
                </div>

                <div className="score-row">
                  <div className="team-name">{match.teamAName}</div>
                  <div className="score">{match.score.currentSetScore.teamA}</div>
                </div>

                <div className="score-row">
                  <div className="team-name">{match.teamBName}</div>
                  <div className="score">{match.score.currentSetScore.teamB}</div>
                </div>

                <div className="small" style={{ marginTop: 12 }}>
                  Current Set: {match.score.currentSet} | Sets: {match.score.teamASetWins} -{" "}
                  {match.score.teamBSetWins}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2>Completed Matches</h2>
        {data.completedMatches.length === 0 ? (
          <p className="empty">No completed matches yet.</p>
        ) : (
          <div className="grid">
            {data.completedMatches.map((match) => (
              <div className="live-card" key={match.fixtureId}>
                <div className="live-top">
                  <div>
                    <strong>{match.leagueName}</strong>
                    <div className="small">
                      {match.phase} • {match.date} • {match.startTime} • {match.court}
                    </div>
                  </div>
                  <span className="badge">{match.winnerTeamName || "Draw"}</span>
                </div>

                <div className="score-row">
                  <div className="team-name">{match.teamAName}</div>
                  <div className="score">{match.teamASetsWon}</div>
                </div>

                <div className="score-row">
                  <div className="team-name">{match.teamBName}</div>
                  <div className="score">{match.teamBSetsWon}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2>League Standings</h2>

        {data.leagues.map((league) => (
          <div className="league-block" key={league.leagueId}>
            <div className="league-title">{league.leagueName}</div>

            {league.teams.length === 0 ? (
              <p className="empty">No teams in this league yet.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Team</th>
                      <th>Players</th>
                      <th>Played</th>
                      <th>Wins</th>
                      <th>Draws</th>
                      <th>Losses</th>
                      <th>Points</th>
                      <th>Sets</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {league.teams.map((team) => (
                      <tr key={team["Team ID"]}>
                        <td>
                          <span className="rank-pill">{team.Rank}</span>
                        </td>
                        <td>{team["Team Name"]}</td>
                        <td>
                          {team["Player 1"]} &amp; {team["Player 2"]}
                        </td>
                        <td>{team["Matches Played"]}</td>
                        <td>{team.Wins}</td>
                        <td>{team.Draws}</td>
                        <td>{team.Losses}</td>
                        <td>{team.Points}</td>
                        <td>
                          {team["Sets Won"]} / {team["Sets Lost"]}
                        </td>
                        <td>
                          {team["Table Status"] ? (
                            <span className={statusClass(team["Table Status"])}>
                              {team["Table Status"]}
                            </span>
                          ) : (
                            <span className="small">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}
