import birminghamCity from './birmingham-city.svg';
import blackburnRovers from './blackburn-rovers.svg';
import bristolCity from './bristol-city.svg';
import charltonAthletic from './charlton-athletic.svg';
import coventryCity from './coventry-city.svg';
import derbyCounty from './derby-county.svg';
import hullCity from './hull-city.svg';
import ipswichTown from './ipswich-town.svg';
import leicesterCity from './leicester-city.svg';
import middlesbrough from './middlesbrough.svg';
import millwall from './millwall.svg';
import norwichCity from './norwich-city.svg';
import oxfordUnited from './oxford-united.svg';
import portsmouth from './portsmouth.svg';
import prestonNorthEnd from './preston-north-end.svg';
import queensParkRangers from './queens-park-rangers.svg';
import sheffieldUnited from './sheffield-united.svg';
import sheffieldWednesday from './sheffield-wednesday.svg';
import southampton from './southampton.svg';
import stokeCity from './stoke-city.svg';
import swanseaCity from './swansea-city.svg';
import watford from './watford.svg';
import westBromwichAlbion from './west-bromwich-albion.svg';
import wrexham from './wrexham.svg';

const crests: Record<string, string> = {
  'birmingham-city': birminghamCity,
  'blackburn-rovers': blackburnRovers,
  'bristol-city': bristolCity,
  'charlton-athletic': charltonAthletic,
  'coventry-city': coventryCity,
  'derby-county': derbyCounty,
  'hull-city': hullCity,
  'ipswich-town': ipswichTown,
  'leicester-city': leicesterCity,
  middlesbrough: middlesbrough,
  millwall: millwall,
  'norwich-city': norwichCity,
  'oxford-united': oxfordUnited,
  portsmouth: portsmouth,
  'preston-north-end': prestonNorthEnd,
  'queens-park-rangers': queensParkRangers,
  'sheffield-united': sheffieldUnited,
  'sheffield-wednesday': sheffieldWednesday,
  southampton: southampton,
  'stoke-city': stokeCity,
  'swansea-city': swanseaCity,
  watford: watford,
  'west-bromwich-albion': westBromwichAlbion,
  wrexham: wrexham,
};

export const getCrest = (crestKey: string): string => {
  return crests[crestKey] ?? '';
};

export default crests;
