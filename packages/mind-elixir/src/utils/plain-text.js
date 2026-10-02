import {
  plaintextToMindElixir,
} from "mind-elixir/plaintextConverter";
import { dataToMindNodes } from '../core/node.js'
export const plainTextToMindNodes = source => dataToMindNodes(plaintextToMindElixir(source))
