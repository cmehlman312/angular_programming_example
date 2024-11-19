export interface TherapyPlan {
  number: string;
  medicationname: string;
  status: string;
  requestor: string;
  specialty: {
    rheumatology: boolean;
    gastroenterology: boolean;
    neurology: boolean;
    endocrinology: boolean;
    supportive: boolean;
  };
  requiredlabs: [
    {
      lab: string;
      interval: string;
      custominterval: string;
      comments: string;
    }
  ];
  treatmentinformation: [
    {
      treatment: string;
      interval: string;
      custominterval: string;
    }
  ];
  treatmentparameters: [
    {
      parameter: string;
      interval: string;
      custominterval: string;
    }
  ];
  vitals: [
    {
      vitals: string;
      interval: string;
      custominterval: string;
      comments: string;
    }
  ];
  premedications: [
    {
      premedication: string;
      dose: string;
      adminduration: string;
      route: string;
      frequency: string;
      rate: string;
      admininstructions: string;
      interval: string;
      custominterval: string;
      comments: string;
    }
  ];
  hydration: [
    {
      hydration: string;
      dose: string;
      adminduration: string;
      route: string;
      frequency: string;
      rate: string;
      admininstructions: string;
      interval: string;
      custominterval: string;
      comments: string;
    }
  ];
  nonchemomedicationorders: [
    {
      nonchemomedicationorder: string;
      dose: string;
      adminduration: string;
      route: string;
      frequency: string;
      rate: string;
      admininstructions: string;
      interval: string;
      custominterval: string;
      comments: string;
    }
  ];
  postmedications: [
    {
      postmedication: string;
      dose: string;
      adminduration: string;
      route: string;
      frequency: string;
      rate: string;
      admininstructions: string;
      interval: string;
      custominterval: string;
      comments: string;
    }
  ];
  emergencymedications: [
    {
      emergencymedication: string;
      dose: string;
      adminduration: string;
      route: string;
      frequency: string;
      rate: string;
      admininstructions: string;
      interval: string;
      custominterval: string;
      comments: string;
    }
  ];
  takehomemedications: [
    {
      takehomemedication: string;
      dose: string;
      adminduration: string;
      route: string;
      frequency: string;
      rate: string;
      admininstructions: string;
      interval: string;
      custominterval: string;
      comments: string;
    }
  ];
  assignedReviewer: {
    user: string;
    created_date: Date;
  };
  reviewer: [
    {
      user: string;
      action: string;
      comments: string;
      created_date: Date;
    }
  ];
  meeting: {
    agenda_date: Date;
    approved: boolean;
    approved_by: string;
    approved_date: Date;
    notesfrommeeting: string;
  };
  assignedBuilder: {
    user: string;
    created_date: Date;
  };
  builder: [
    {
      user: string;
      action: string;
      comments: string;
      created_date: Date;
    }
  ];
  assignedVerifier: {
    user: string;
    created_date: Date;
  };
  verifier: [
    {
      user: string;
      action: string;
      comments: string;
      created_date: Date;
    }
  ];
  actionstaken: {
    user: string;
    event: string;
    created_date: Date;
  };
  lock: {
    isLocked: boolean;
    lockedby: string;
    lockdate: Date;
  };
  created: {
    created_date: Date;
    user: string;
  };
}
