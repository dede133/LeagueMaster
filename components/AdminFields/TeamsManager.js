import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const TeamsManager = ({ teams }) => {
  const [expandedTeam, setExpandedTeam] = useState(null);

  const toggleExpand = (teamId) => {
    setExpandedTeam((prev) => (prev === teamId ? null : teamId));
  };

  return (
    <div className="p-6 bg-gray-50 shadow-inner rounded-lg space-y-6">
      {teams.teams?.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay equipos inscritos en esta liga.
        </p>
      ) : (
        <div className="space-y-4">
          {teams.teams?.map((team) => (
            <Card
              key={team.team_id}
              onClick={() => toggleExpand(team.team_id)}
              className={`cursor-pointer hover:shadow-lg transition-shadow w-full ${
                expandedTeam === team.team_id ? 'shadow-md' : ''
              }`}
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {team.name}
                  </CardTitle>
                  <Badge
                    className={`${
                      team.payment_status
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {team.payment_status ? 'Pagado' : 'Pendiente de pago'}
                  </Badge>
                </div>
              </CardHeader>
              {expandedTeam === team.team_id && (
                <CardContent>
                  <div className="space-y-4 p-2">
                    <h4 className="text-md font-medium text-gray-700">
                      Jugadores:
                    </h4>
                    <ul className="space-y-2">
                      {team.players.map((player, index) => (
                        <li
                          key={index}
                          className="p-2 bg-gray-100 rounded-md shadow-sm"
                        >
                          <p className="text-sm font-medium text-gray-800">
                            {player.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            Dorsal: {player.dorsal} - DNI: {player.dni}
                          </p>
                          <p className="text-xs text-gray-600">
                            Teléfono: {player.phone}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="secondary"
                      className="text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Opciones del equipo ${team.name}`);
                      }}
                    >
                      Ver opciones
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamsManager;
