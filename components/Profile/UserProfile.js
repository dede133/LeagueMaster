'use client';
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { User, Mail, BarChart } from 'lucide-react'; // Iconos modernos
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserProfile = ({ user }) => {
  const [stats, setStats] = useState({
    matchesPlayed: 0,
    leaguesParticipated: 0,
    matchesPerMonth: [],
    leaguesPerMonth: [],
  });

  useEffect(() => {
    setTimeout(() => {
      setStats({
        matchesPlayed: 25,
        leaguesParticipated: 3,
        matchesPerMonth: [3, 4, 2, 5, 6, 2, 4, 3, 5, 4, 3, 6],
        leaguesPerMonth: [1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1],
      });
    }, 1000);
  }, []);

  const months = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ];

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Partidos jugados',
        data: stats.matchesPerMonth,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        barThickness: 12,
      },
      {
        label: 'Ligas participadas',
        data: stats.leaguesPerMonth,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
        barThickness: 12,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 12 },
          color: '#4A5568',
        },
      },
    },
    scales: {
      x: {
        ticks: { font: { size: 11 }, color: '#718096' },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: '#718096' },
      },
    },
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <div className="border-t pt-4 mb-6 grid grid-cols-2 gap-4">
        <div className="bg-blue-100 p-3 rounded-lg flex flex-col items-center shadow-md">
          <p className="text-blue-600 text-lg font-semibold">
            {stats.matchesPlayed}
          </p>
          <p className="text-sm text-gray-600">Partidos jugados</p>
        </div>
        <div className="bg-green-100 p-3 rounded-lg flex flex-col items-center shadow-md">
          <p className="text-green-600 text-lg font-semibold">
            {stats.leaguesParticipated}
          </p>
          <p className="text-sm text-gray-600">Ligas participadas</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
          <BarChart className="mr-2 text-blue-500" /> Estadísticas mensuales
        </h3>
        <div className="w-full h-60 bg-gray-50 p-3 rounded-lg shadow-md">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
