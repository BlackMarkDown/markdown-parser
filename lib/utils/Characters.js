// White Spaces
export const SPACE = '\u0020';
export const TAB = '\u0009';
export const NEWLINE = '\u000A';
export const LINE_TABULATION = '\u000B';
export const FORM_FEED = '\u000C';
export const CARRIAGE_RETURN = '\u000D';
export const WHITE_SPACES = [
  SPACE,
  TAB,
  NEWLINE,
  LINE_TABULATION,
  FORM_FEED,
  CARRIAGE_RETURN,
];

// NOTE: it is Unicode 'Zs' Class, not 'ZS' actually :D
export const UNICODE_ZS_CLASS = [
  '\u0020', // SPAC
  '\u00A0', // NO-BREAK SPACE
  '\u1680', // OGHAM SPACE MARK
  '\u2000', // EN QUAD
  '\u2001', // EM QUAD
  '\u2002', // EN SPACE
  '\u2003', // EM SPACE
  '\u2004', // THREE-PER-EM SPACE
  '\u2005', // FOUR-PER-EM SPACE
  '\u2006', // SIX-PER-EM SPACE
  '\u2007', // FIGURE SPACE
  '\u2008', // PUNCTUATION SPACE
  '\u2009', // THIN SPACE
  '\u200A', // HAIR SPACE
  '\u202F', // NARROW NO-BREAK SPACE
  '\u205F', // MEDIUM MATHEMATICAL SPACE
  '\u3000', // IDEOGRAPHIC SPACE
];

export const UNICODE_WHITE_SPACES = [
  ...UNICODE_ZS_CLASS,
  TAB,
  CARRIAGE_RETURN,
  NEWLINE,
  FORM_FEED,
];

export const HYPHEN_MINUS = '\u002D';
export const UNDERSCORE = '\u005F';
export const ASTERISK = '\u002A';
export const NUMBER_SIGN = '\u0023';
export const EQUALS_SIGN = '\u003D';
export const BACKTICK = '\u0060';
export const TILDE = '\u007E';
export const GREATER_THAN_SIGN = '\u003E';
export const PLUS = '\u002B';
export const FULL_STOP = '\u002E';
export const RIGHT_PARENTHESIS = '\u0029';

export const DIGIT_ZERO = '\u0030';
export const DIGIT_ONE = '\u0031';
export const DIGIT_TWO = '\u0032';
export const DIGIT_THREE = '\u0033';
export const DIGIT_FOUR = '\u0034';
export const DIGIT_FIVE = '\u0035';
export const DIGIT_SIX = '\u0036';
export const DIGIT_SEVEN = '\u0037';
export const DIGIT_EIGHT = '\u0038';
export const DIGIT_NINE = '\u0039';

export const DIGITS = [
  DIGIT_ZERO,
  DIGIT_ONE,
  DIGIT_TWO,
  DIGIT_THREE,
  DIGIT_FOUR,
  DIGIT_FIVE,
  DIGIT_SIX,
  DIGIT_SEVEN,
  DIGIT_EIGHT,
  DIGIT_NINE,
];

export const PUNCTUATIONS = []; // TODO
