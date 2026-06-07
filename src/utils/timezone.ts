export const formatToIST = (
  dateString: string,
  formatType: 'full' | 'date' | 'time' | 'short-date' = 'full'
): string => {
  const date = new Date(dateString);
  
  const optionsMap: Record<typeof formatType, Intl.DateTimeFormatOptions> = {
    full: {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    },
    date: {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    },
    'short-date': {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short'
    },
    time: {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }
  };

  const formatted = new Intl.DateTimeFormat('en-IN', optionsMap[formatType]).format(date);
  
  // Clean up double spaces or formatting quirks
  return formatted.replace(/\s+/g, ' ');
};

export const formatToLocalVenueTime = (
  dateString: string,
  stadiumId: string
): string => {
  const date = new Date(dateString);
  
  // Map stadium IDs to approximate US/Canada/Mexico time zones
  const stadiumTimezones: Record<string, string> = {
    metlife: 'America/New_York',
    azteca: 'America/Mexico_City',
    sofi: 'America/Los_Angeles',
    att: 'America/Chicago',
    mercedes: 'America/New_York',
    lincoln: 'America/New_York',
    lumen: 'America/Los_Angeles',
    levis: 'America/Los_Angeles',
    gillette: 'America/New_York',
    hardrock: 'America/New_York',
    nrg: 'America/Chicago',
    arrowhead: 'America/Chicago',
    bcplace: 'America/Vancouver',
    bmo: 'America/Toronto',
    bbva: 'America/Monterrey',
    akron: 'America/Mexico_City'
  };

  const timeZone = stadiumTimezones[stadiumId] || 'UTC';
  
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  }).format(date);
};

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isOver: boolean;
}

export const getCountdown = (targetDateString: string, currentVirtualDate?: Date): CountdownTime => {
  const target = new Date(targetDateString).getTime();
  const now = (currentVirtualDate || new Date()).getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isOver: false };
};
