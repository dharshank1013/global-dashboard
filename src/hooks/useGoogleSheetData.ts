import { useQuery } from '@tanstack/react-query';
import Papa from 'papaparse';
import { type University } from '../types';

// The local backend CSV file (placed in /public/data.csv)
const CSV_URL = '/data.csv';

export const KARUNYA_UNI: University = {
  sNo: 0,
  name: "Karunya Institute of Technology and Sciences",
  country: "India",
  latitude: 10.9368,
  longitude: 76.7423,
  logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Karunya_Institute_of_Technology_and_Sciences_logo.png/220px-Karunya_Institute_of_Technology_and_Sciences_logo.png",
  inboundStudents: 0,
  outboundStudents: 0,
  inboundFaculty: 0,
  outboundFaculty: 0,
};

export const useGoogleSheetData = () => {
  return useQuery({
    queryKey: ['universitiesData'],
    queryFn: async (): Promise<University[]> => {
      // Append a timestamp to prevent browser caching of the CSV file
      const response = await fetch(`${CSV_URL}?t=${new Date().getTime()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch CSV data');
      }
      const csvString = await response.text();

      return new Promise((resolve, reject) => {
        Papa.parse(csvString, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            try {
              const data = results.data.map((row: any) => ({
                sNo: parseInt(row['S.No']) || 0,
                name: row['University Name'],
                country: row['Country'],
                latitude: parseFloat(row['Latitude']),
                longitude: parseFloat(row['Longitude']),
                logoUrl: row['Logo URL'],
                inboundStudents: parseInt(row['Inbound Students']) || 0,
                outboundStudents: parseInt(row['Outbound Students']) || 0,
                inboundFaculty: parseInt(row['Inbound Visiting Faculty']) || 0,
                outboundFaculty: parseInt(row['Outbound Visiting Faculty']) || 0,
              }));
              resolve(data);
            } catch (err) {
              reject(err);
            }
          },
          error: (error: Error) => {
            reject(error);
          }
        });
      });
    },
    staleTime: 2000,
    refetchInterval: 5000, // Poll every 5 seconds to automatically sync with the CSV backend
  });
};
