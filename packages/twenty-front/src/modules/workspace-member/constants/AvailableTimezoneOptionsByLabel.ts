/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @nx/workspace-max-consts-per-file */
import { SelectOption } from '@/ui/input/components/Select';
import { IANA_TIME_ZONES } from '@/workspace-member/constants/IanaTimeZones';
import { detectTimeZone } from '@/workspace-member/utils/detectTimeZone';
import { formatTimeZoneLabel } from '@/workspace-member/utils/formatTimeZoneLabel';

export const AVAILABLE_TIME_ZONE_OPTIONS_BY_LABEL = IANA_TIME_ZONES.reduce<
  Record<string, SelectOption<string>>
>((result, ianaTimeZone) => {
  const isSystemTimeZone = detectTimeZone() === ianaTimeZone;
  const timeZoneLabel = formatTimeZoneLabel(ianaTimeZone);

  // Remove the '(GMT±00:00) ' prefix from the label.
  const timeZoneName = timeZoneLabel.slice(11);

  // Skip time zones with GMT, UTC, or UCT in their name,
  // and duplicates.
  if (
    timeZoneName.includes('GMT') ||
    timeZoneName.includes('UTC') ||
    timeZoneName.includes('UCT') ||
    timeZoneLabel in result
  ) {
    return result;
  }

  return {
    ...result,
    [timeZoneLabel]: {
      label: `${timeZoneLabel} ${isSystemTimeZone ? '(System preferred)' : ''}`,
      value: ianaTimeZone,
    },
  };
}, {});
