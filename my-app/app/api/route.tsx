import fs from "fs";
import path from "path";
import papaparse from "papaparse";

const config = {
  header: false,
  dynamicTyping: true,
  delimiter: ",",
};

export function GET(req: Request, res: Response) {
  try {
    const filePath = path.join(process.cwd(), "jobsData.csv");
    const fileContent = fs.readFileSync(filePath, "utf8");
    const parsedData = papaparse.parse(fileContent, config);

    // console.log(fileContent);

    if (parsedData.errors && parsedData.errors.length > 0) {
      throw new Error(parsedData.errors[0].message);
    }

    return new Response(JSON.stringify(parsedData), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
  } catch (error: any) {
    return new Response(error.message || error.toString(), {
      status: 500,
      headers: {
        "content-type": "text/plain;charset=UTF-8",
      },
    });
  }
}
