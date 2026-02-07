const PDFParser = require("pdf2json");

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.error("No file uploaded");
      return new Response("No file uploaded", { status: 400 });
    }

    console.log("File received:", file.name, file.size, file.type);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("Buffer created, parsing PDF with pdf2json...");

    const pdfParser = new PDFParser(null, 1);

    const parsedText = await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        // @ts-ignore
        resolve(pdfParser.getRawTextContent());
      });

      pdfParser.parseBuffer(buffer);
    });

    console.log("PDF parsed successfully, text length:", (parsedText as string).length);

    return Response.json({
      text: parsedText,
    });
  } catch (error) {
    console.error("Error processing resume:", error);
    return new Response("Internal Server Error: " + error, { status: 500 });
  }
}


