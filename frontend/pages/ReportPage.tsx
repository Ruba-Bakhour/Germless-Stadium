'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import router from 'next/router';
import  Header  from './Header';
interface Report {
  id: string;
  title: string;
  created_at: string;
  total_seats: number;
  distance: string;
}

const ReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  useEffect(() => {

    const fetchReports = async () => {
      const { data, error } = await supabase.from('Report').select('*');
      if (error) {
        console.error('Error fetching reports:', error.message, error.details, error.hint);
      } else {
        setReports(data);
      }
    };
    fetchReports();}, []);

  // Delete Report Function
  const handleDelete = async (reportId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this report?");
    if (!confirmDelete) return;
    const { error } = await supabase.from('Report').delete().eq('id', reportId);
    if (error) {
      console.error("Error deleting report:", error.message);
    } else {
      // Remove the deleted report from the state
      setReports(reports.filter(report => report.id !== reportId));
      // Clear the selected report if it was deleted
      if (selectedReport && selectedReport.id === reportId) {
        setSelectedReport(null);
      }
    }
  };

  // Download Report Function
  const handleDownload = (report: Report) => {
    const reportData = `
      Report Title: ${report.title}
      Date and Time: ${report.created_at}
      Total Ready Seats: ${report.total_seats} seats
      Total Distance: ${report.distance}
    `;
    const blob = new Blob([reportData], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${report.title}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Header showBackButton={true} title="Display Disinfection Reports" />

      <div className="min-h-screen bg-blue-100 p-6 font-sans">
        <div className="flex gap-6 mt-4">
          {/* Reports Table */}
          <div className="w-2/3 bg-white p-4 rounded-md shadow-md mt-12">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-gray-600 p-3 text-left">Reports Title</th>
                  <th className="text-gray-600 p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="text-gray-600 border-b hover:bg-gray-200">
                    <td className="p-3">{report.title}</td>
                    <td className="p-3">
                      <span className="text-blue-600 cursor-pointer mr-2" onClick={() => setSelectedReport(report)}>Open</span>
                      <span className="text-blue-600 cursor-pointer mr-2" onClick={() => handleDownload(report)}>Download</span>
                      <span className="text-blue-600 cursor-pointer" onClick={() => handleDelete(report.id)}>Delete</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Report Details */}
          <div className="w-1/3 h-40 bg-white p-4 rounded-md shadow-md mt-24">
            {selectedReport ? (
              <>
                <h3 className="text-gray-600 text-lg font-bold mb-3">{selectedReport.title}</h3>
                <p className="text-gray-600 text-sm mb-2"><strong>Date and Time:</strong> {selectedReport.created_at}</p>
                <p className="text-gray-600 text-sm mb-2"><strong>Total Ready seats:</strong> {selectedReport.total_seats} seats</p>
                <p className="text-gray-600 text-sm mb-2"><strong>Total Distance:</strong> {selectedReport.distance}</p>
              </>
            ) : (
              <p className="text-gray-600 text-sm">Select a report to view details</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportsPage;

