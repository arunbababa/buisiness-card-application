import "@testing-library/jest-dom";
// jest.setup.js
import { TextEncoder, TextDecoder as NodeTextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = NodeTextDecoder as unknown as typeof TextDecoder;

require("dotenv").config();
