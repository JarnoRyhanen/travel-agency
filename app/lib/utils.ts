import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string): string => {
  return dayjs(dateString).format('MMMM DD, YYYY');
};

const tryParseJson = (
  value: string
): { parsed: true; value: unknown } | { parsed: false } => {
  try {
    return { parsed: true, value: JSON.parse(value) };
  } catch {
    return { parsed: false };
  }
};

const extractJsonBlock = (text: string): string | null => {
  const startIndex = text.search(/[\[{]/);

  if (startIndex === -1) {
    return null;
  }

  const opening = text[startIndex];
  const closing = opening === '{' ? '}' : ']';
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = startIndex; index < text.length; index += 1) {
    const char = text[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === opening) {
      depth += 1;
    } else if (char === closing) {
      depth -= 1;

      if (depth === 0) {
        return text.slice(startIndex, index + 1);
      }
    }
  }

  return null;
};

export function parseMarkdownToJson(markdownText: string): unknown | null {
  const trimmedText = markdownText.trim();

  const directJson = tryParseJson(trimmedText);
  if (directJson.parsed) {
    return directJson.value;
  }

  const fencedBlockMatch = trimmedText.match(
    /```(?:json)?\s*([\s\S]*?)\s*```/i
  );
  if (fencedBlockMatch?.[1]) {
    const parsedBlock = tryParseJson(fencedBlockMatch[1].trim());
    if (parsedBlock.parsed) {
      return parsedBlock.value;
    }
  }

  const extractedJson = extractJsonBlock(trimmedText);
  if (extractedJson) {
    const parsedBlock = tryParseJson(extractedJson);
    if (parsedBlock.parsed) {
      return parsedBlock.value;
    }
  }

  console.error('No valid JSON found in AI response.');
  return null;
}

export function parseTripData(jsonString: string): Trip | null {
  try {
    const data: Trip = JSON.parse(jsonString);

    return data;
  } catch (error) {
    console.error('Failed to parse trip data:', error);
    return null;
  }
}

export function getFirstWord(input: string = ''): string {
  return input.trim().split(/\s+/)[0] || '';
}

export const calculateTrendPercentage = (
  countOfThisMonth: number,
  countOfLastMonth: number
): TrendResult => {
  if (countOfLastMonth === 0) {
    return countOfThisMonth === 0
      ? { trend: 'no change', percentage: 0 }
      : { trend: 'increment', percentage: 100 };
  }

  const change = countOfThisMonth - countOfLastMonth;
  const percentage = Math.abs((change / countOfLastMonth) * 100);

  if (change > 0) {
    return { trend: 'increment', percentage };
  } else if (change < 0) {
    return { trend: 'decrement', percentage };
  } else {
    return { trend: 'no change', percentage: 0 };
  }
};

export const formatKey = (key: keyof TripFormData) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

type GridUser = BaseUser & {
  status: 'user' | 'admin';
};

export const normalizeUser = (
  user: Record<string, unknown>,
  index: number
): GridUser => {
  const joinedAt =
    typeof user.joinedAt === 'string'
      ? user.joinedAt
      : typeof user.dateJoined === 'string'
        ? user.dateJoined
        : '';

  return {
    id:
      typeof user.$id === 'string'
        ? user.$id
        : typeof user.id === 'string'
          ? user.id
          : String(index),
    name: typeof user.name === 'string' ? user.name : 'Unknown user',
    email: typeof user.email === 'string' ? user.email : '',
    imageUrl: typeof user.imageUrl === 'string' ? user.imageUrl : '',
    dateJoined: joinedAt ? formatDate(joinedAt) : '',
    status: user.status === 'admin' ? 'admin' : 'user',
  };
};
