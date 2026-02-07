
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Checking Prisma Client for Job model...");

    // We can't easily check types at runtime effectively without just trying it, 
    // but we can check if the model exists and try a dry-run or inspection.

    // Introspect the dmmf to see if 'department' is known
    // @ts-ignore
    const dmmf = await prisma._getDmmf();
    const jobModel = dmmf.datamodel.models.find((m: any) => m.name === 'Job');

    if (jobModel) {
        console.log("Job Model Found.");
        const deptField = jobModel.fields.find((f: any) => f.name === 'department');
        if (deptField) {
            console.log("✅ Field 'department' FOUND in Prisma Client DMMF.");
            console.log("Field details:", deptField);
        } else {
            console.error("❌ Field 'department' NOT FOUND in Prisma Client DMMF.");
            console.log("Available fields:", jobModel.fields.map((f: any) => f.name));
        }
    } else {
        console.error("❌ Job Model not found in DMMF.");
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
