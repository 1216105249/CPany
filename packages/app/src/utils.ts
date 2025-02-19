import { Ref, ref, unref } from 'vue';
import {
  IContest,
  IProblem,
  ParticipantType,
  isCodeforces,
  isAtCoder,
  isNowCoder,
  isPintia,
  isLuogu,
  isHdu
} from '@cpany/types';

export function isUndef<T>(object: T | undefined | null): object is undefined | null {
  return object === undefined || object === null;
}

export function isDef<T>(object: T | undefined | null): object is T {
  return object !== undefined && object !== null;
}

function alignNumber(value: number) {
  return (value < 10 ? '0' : '') + value;
}

export function toDate(seconds: number | Ref<number>) {
  const date = new Date(unref(seconds) * 1000);
  const prefix = `${date.getFullYear()}-${alignNumber(date.getMonth() + 1)}-${alignNumber(
    date.getDate()
  )} `;
  const hours = alignNumber(date.getHours());
  const minutes = alignNumber(date.getMinutes());
  return ref(prefix + hours + ':' + minutes);
}

export function toNumDuration(duration: number | Ref<number>) {
  const seconds = unref(duration);
  const hour = Math.floor(seconds / 3600);
  const minute = Math.floor((seconds % 3600) / 60);
  const second = Math.floor(seconds % 60);
  return ref(`${hour}:${alignNumber(minute)}:${alignNumber(second)}`);
}

export function toDuration(duration: number | Ref<number>) {
  const seconds = unref(duration);
  const hour = Math.floor(seconds / 3600);
  const minute = Math.floor((seconds % 3600) / 60);
  const second = Math.floor(seconds % 60);
  return ref(
    [
      hour > 0 ? hour + ' 小时' : '',
      minute > 0 ? minute + ' 分钟' : '',
      second > 0 ? second + ' 秒' : ''
    ].join(' ')
  );
}

export const displayPlatform = (type: string) => {
  const wrapper = { type };
  if (isCodeforces(wrapper)) {
    return 'Codeforces';
  } else if (isNowCoder(wrapper)) {
    return '牛客竞赛';
  } else if (isHdu(wrapper)) {
    return 'HDu';
  } else if (isLuogu(wrapper)) {
    return '洛谷';
  } else if (isPintia(wrapper)) {
    return '拼题A';
  } else if (isAtCoder(wrapper)) {
    return 'AtCoder';
  } else {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

export const displayContestType = (contest: IContest) => {
  if (isCodeforces(contest)) {
    if (/Round/.test(contest.name) || /Div/.test(contest.name)) {
      return 'Codeforces Round';
    } else if (/gym/.test(contest.type)) {
      return 'Codeforces Gym';
    } else {
      return 'Codeforces';
    }
  } else if (isNowCoder(contest)) {
    return '牛客竞赛';
  } else if (isHdu(contest)) {
    return 'HDu';
  } else if (isLuogu(contest)) {
    return '洛谷';
  } else if (isPintia(contest)) {
    return '拼题A';
  } else if (isAtCoder(contest)) {
    return 'AtCoder';
  } else {
    const type = contest.type;
    return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

export const displayProblemType = (problem: IProblem) => {
  return displayPlatform(problem.type);
};

export const displayParticipantType = (type: ParticipantType) => {
  if (type === ParticipantType.CONTESTANT) {
    return '比赛';
  } else if (type === ParticipantType.MANAGER) {
    return '管理';
  } else if (type === ParticipantType.OUT_OF_COMPETITION) {
    return '打星';
  } else if (type === ParticipantType.PRACTICE) {
    return '练习';
  } else if (type === ParticipantType.VIRTUAL) {
    return '虚拟';
  } else {
    return '';
  }
};
