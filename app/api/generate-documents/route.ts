import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { formType, ...formData } = await req.json();

    // In a production environment, this would call an AI service
    // For now, we'll return a mock response based on the form type
    let generatedText = "";

    if (formType === "21-0781") {
      generatedText = `I, ${formData.veteranName}, served in the ${formData.branch} from ${formData.serviceDates}. During my service, I experienced the following traumatic event(s): ${formData.traumaticEvents}. These experiences have significantly impacted my mental health and daily functioning.`;
    } else if (formType === "21-10210") {
      generatedText = `I, ${formData.claimantName || formData.veteranName}, am providing this statement regarding ${formData.claimantName ? formData.veteranName : "my"} service-connected ${formData.disability}. ${formData.claimantName ? formData.veteranName : "I"} served in the ${formData.branch} from ${formData.serviceDates}${formData.deployments ? ` with deployments to ${formData.deployments}` : ""}. This condition is related to military service in the following way: ${formData.relationToService}${formData.traumaticEvents ? `\n\nRelevant events include: ${formData.traumaticEvents}` : ""}`;
    } else {
      generatedText = `I, ${formData.veteranName}, am submitting this statement in support of my VA claim: ${formData.statement}`;
    }

    return NextResponse.json({ text: generatedText });
  } catch (error) {
    console.error("Error generating document:", error);
    return NextResponse.json({ error: "Failed to generate document" }, { status: 500 });
  }
}
