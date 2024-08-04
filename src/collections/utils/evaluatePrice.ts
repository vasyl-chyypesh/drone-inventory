import { MESSAGES, PRICE_INPUT_REGEX } from './constants';

export function evaluatePrice(priceInput: string): string {
  // TODO: think about safer way
  if (priceInput.length < 256 && PRICE_INPUT_REGEX.test(priceInput)) {
    return eval(priceInput) as string;
  }
  throw new Error(MESSAGES.INVALID_PRICE_INPUT);
}
