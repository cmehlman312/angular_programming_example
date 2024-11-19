export interface Meeting {
  meeting_date: string;
  meeting_time: string;
  location: string;
  meeting_link: string;
  attendees: [
    {
      name: string;
    }
  ];
  status: string;
  notes: string;
  created_date: Date;
}
