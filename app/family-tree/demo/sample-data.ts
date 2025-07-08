
export interface Person {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  date_of_birth: string | null;
  father_id: string | null;
  mother_id: string | null;
}

export interface Marriage {
  id: string;
  partner1_id: string;
  partner2_id: string;
  start_date: string | null;
}

export const samplePersons: Person[] = [
  {
    id: '1',
    name: '父方の祖父',
    gender: 'male',
    date_of_birth: '1950-01-01',
    father_id: null,
    mother_id: null
  },
  {
    id: '2',
    name: '父方の祖母',
    gender: 'female',
    date_of_birth: '1952-01-01',
    father_id: null,
    mother_id: null
  },
  {
    id: '3',
    name: '父親',
    gender: 'male',
    date_of_birth: '1980-01-01',
    father_id: '1',
    mother_id: '2'
  },
  {
    id: '4',
    name: '母親',
    gender: 'female',
    date_of_birth: '1982-01-01',
    father_id: '6',
    mother_id: '7'
  },
  {
    id: '5',
    name: 'あなた',
    gender: 'male',
    date_of_birth: '2010-01-01',
    father_id: '3',
    mother_id: '4'
  },
    {
    id: '6',
    name: '母方の祖父',
    gender: 'male',
    date_of_birth: '1955-01-01',
    father_id: null,
    mother_id: null
  },
  {
    id: '7',
    name: '母方の祖母',
    gender: 'female',
    date_of_birth: '1957-01-01',
    father_id: null,
    mother_id: null
  },
];

export const sampleMarriages: Marriage[] = [
  {
    id: '1',
    partner1_id: '1',
    partner2_id: '2',
    start_date: '1975-01-01'
  },
  {
    id: '2',
    partner1_id: '3',
    partner2_id: '4',
    start_date: '2005-01-01'
  },
  {
    id: '3',
    partner1_id: '6',
    partner2_id: '7',
    start_date: '1978-01-01'
  },
];
