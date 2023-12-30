// https://www.npmjs.com/package/args-parser

const ARGUMENT_SEPARATION_REGEX = /([^=\s]+)=?\s*(.*)/;
export type parsedArgsType = Record<string, number | string | boolean>;

export const parseArgs = <T>(argv: string[]): T => {
  const parsedArgs: parsedArgsType = {};
  let argName, argValue;

  argv.forEach(function (arg) {
    // Separate argument for a key/value return
    const out = arg.match(ARGUMENT_SEPARATION_REGEX);
    if (!out) {
        return;
    }
    out.shift();

    // Retrieve the argument name
    argName = out[0];

    // Remove "--" or "-"
    if (argName.indexOf('-') === 0) {
      argName = argName.slice(argName.slice(0, 2).lastIndexOf('-') + 1);
    }

    // Parse argument value or set it to `true` if empty
    argValue =
      out[1] !== ''
        ? parseFloat(out[1]).toString() === out[1]
          ? +out[1]
          : out[1]
        : true;
    parsedArgs[argName] = argValue;
  });

  return parsedArgs as T;
}
