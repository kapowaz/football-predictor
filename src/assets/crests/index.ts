import afcBournemouth from './afc-bournemouth.svg';
import arsenal from './arsenal.svg';
import astonVilla from './aston-villa.svg';
import birminghamCity from './birmingham-city.svg';
import blackburnRovers from './blackburn-rovers.svg';
import brentford from './brentford.svg';
import brightonAndHoveAlbion from './brighton.svg';
import bristolCity from './bristol-city.svg';
import burnley from './burnley.svg';
import charltonAthletic from './charlton-athletic.svg';
import chelsea from './chelsea.svg';
import coventryCity from './coventry-city.svg';
import crystalPalace from './crystal-palace.svg';
import derbyCounty from './derby-county.svg';
import everton from './everton.svg';
import fulham from './fulham.svg';
import hullCity from './hull-city.svg';
import ipswichTown from './ipswich-town.svg';
import leedsUnited from './leeds-united.svg';
import leicesterCity from './leicester-city.svg';
import liverpool from './liverpool.svg';
import manchesterCity from './manchester-city.svg';
import manchesterUnited from './manchester-united.svg';
import middlesbrough from './middlesbrough.svg';
import millwall from './millwall.svg';
import newcastleUnited from './newcastle-united.svg';
import norwichCity from './norwich-city.svg';
import nottinghamForest from './nottingham-forest.svg';
import oxfordUnited from './oxford-united.svg';
import portsmouth from './portsmouth.svg';
import prestonNorthEnd from './preston-north-end.svg';
import queensParkRangers from './queens-park-rangers.svg';
import sheffieldUnited from './sheffield-united.svg';
import sheffieldWednesday from './sheffield-wednesday.svg';
import southampton from './southampton.svg';
import stokeCity from './stoke-city.svg';
import sunderland from './sunderland.svg';
import swanseaCity from './swansea-city.svg';
import tottenhamHotspur from './tottenham-hotspur.svg';
import watford from './watford.svg';
import westBromwichAlbion from './west-bromwich-albion.svg';
import westHamUnited from './west-ham-united.svg';
import wolverhamptonWanderers from './wolverhampton-wanderers.svg';
import wrexham from './wrexham.svg';

const crests: Record<string, string> = {
  'afc-bournemouth': afcBournemouth,
  arsenal: arsenal,
  'aston-villa': astonVilla,
  'birmingham-city': birminghamCity,
  'blackburn-rovers': blackburnRovers,
  brentford: brentford,
  'brighton-and-hove-albion': brightonAndHoveAlbion,
  'bristol-city': bristolCity,
  burnley: burnley,
  'charlton-athletic': charltonAthletic,
  chelsea: chelsea,
  'coventry-city': coventryCity,
  'crystal-palace': crystalPalace,
  'derby-county': derbyCounty,
  everton: everton,
  fulham: fulham,
  'hull-city': hullCity,
  'ipswich-town': ipswichTown,
  'leeds-united': leedsUnited,
  'leicester-city': leicesterCity,
  liverpool: liverpool,
  'manchester-city': manchesterCity,
  'manchester-united': manchesterUnited,
  middlesbrough: middlesbrough,
  millwall: millwall,
  'newcastle-united': newcastleUnited,
  'norwich-city': norwichCity,
  'nottingham-forest': nottinghamForest,
  'oxford-united': oxfordUnited,
  portsmouth: portsmouth,
  'preston-north-end': prestonNorthEnd,
  'queens-park-rangers': queensParkRangers,
  'sheffield-united': sheffieldUnited,
  'sheffield-wednesday': sheffieldWednesday,
  southampton: southampton,
  'stoke-city': stokeCity,
  sunderland: sunderland,
  'swansea-city': swanseaCity,
  'tottenham-hotspur': tottenhamHotspur,
  watford: watford,
  'west-bromwich-albion': westBromwichAlbion,
  'west-ham-united': westHamUnited,
  'wolverhampton-wanderers': wolverhamptonWanderers,
  wrexham: wrexham,
};

export const getCrest = (crestKey: string): string => {
  return crests[crestKey] ?? '';
};

export default crests;
