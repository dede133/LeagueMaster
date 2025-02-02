import React from 'react';
import { generateLeagueLink } from '@/lib/services/league';

const CalendarManager = ({ matches, leagueId, leagueLinks }) => {
  if (!matches || matches.length === 0) {
    return <p>No hay partidos programados.</p>;
  } else {
    console.log('Matches:', matches);
  }

  const groupedMatches = matches.reduce((acc, match) => {
    const matchDate = new Date(match.date).toISOString().split('T')[0];
    if (!acc[matchDate]) {
      acc[matchDate] = [];
    }
    acc[matchDate].push(match);
    return acc;
  }, {});

  const handleGenerateLink = async (leagueId, date) => {
    try {
      console.log('Generando link para la liga y la fecha:', leagueId, date);
      const response = await generateLeagueLink(leagueId, date);
      alert(`Link generado: ${response.link.link}`);
    } catch (error) {
      console.error('Error al generar el link:', error.message);
      alert('Hubo un error al generar el link.');
    }
  };

  const handleCopyLink = (link) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        alert('Link copiado al portapapeles.');
      })
      .catch((error) => {
        console.error('Error al copiar el link:', error.message);
        alert('Hubo un error al copiar el link.');
      });
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Calendario de Partidos</h3>
      <div className="space-y-6">
        {Object.entries(groupedMatches).map(([date, matches]) => {
          const linkForDate = leagueLinks.find(
            (link) => new Date(link.date).toISOString().split('T')[0] === date
          );

          return (
            <div key={date} className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold">{date}</h4>
                {linkForDate ? (
                  <button
                    onClick={() => handleCopyLink(linkForDate.link)}
                    className="bg-green-500 text-white text-sm px-4 py-2 rounded-md hover:bg-green-600 transition"
                  >
                    Copiar Link
                  </button>
                ) : (
                  <button
                    onClick={() => handleGenerateLink(leagueId, date)}
                    className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition"
                  >
                    Generar Link
                  </button>
                )}
              </div>
              <ul className="space-y-2">
                {matches.map((match) => (
                  <li key={match.match_id} className="border-b py-2">
                    {`${match.time}: ${match.home_team_name} vs. ${match.away_team_name}`}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarManager;
