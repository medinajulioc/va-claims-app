import { z } from "zod";

export const schemas = {
  "21-0781": z.object({
    veteranName: z.string().min(1, "Veteran's name is required"),
    veteranSSN: z.string().min(1, "Veteran's SSN is required"),
    veteranDateOfBirth: z.string().min(1, "Date of birth is required"),
    veteranAddress: z.string().min(1, "Address is required"),
    veteranPhone: z.string().min(1, "Phone number is required"),
    veteranEmail: z.string().email("Invalid email format").optional().or(z.literal("")),
    branch: z.string().min(1, "Branch of service is required"),
    serviceDates: z.string().min(1, "Service dates are required"),
    traumaticEvents: z.string().min(1, "Traumatic events description is required")
  }),
  "21-10210": z.object({
    veteranName: z.string().min(1, "Veteran's name is required"),
    veteranSSN: z.string().min(1, "Veteran's SSN is required"),
    veteranDateOfBirth: z.string().min(1, "Date of birth is required"),
    veteranAddress: z.string().min(1, "Address is required"),
    veteranPhone: z.string().min(1, "Phone number is required"),
    veteranEmail: z.string().email("Invalid email format").optional().or(z.literal("")),
    claimantName: z.string().optional().or(z.literal("")),
    claimantSSN: z.string().optional().or(z.literal("")),
    claimantAddress: z.string().optional().or(z.literal("")),
    claimantPhone: z.string().optional().or(z.literal("")),
    claimantEmail: z.string().email("Invalid email format").optional().or(z.literal("")),
    branch: z.string().min(1, "Branch of service is required"),
    serviceDates: z.string().min(1, "Service dates are required"),
    deployments: z.string().optional().or(z.literal("")),
    disability: z.string().min(1, "Disability description is required"),
    relationToService: z.string().min(1, "Relation to service is required"),
    traumaticEvents: z.string().optional().or(z.literal("")),
    witnessName: z.string().optional().or(z.literal("")),
    witnessRelationship: z.string().optional().or(z.literal("")),
    witnessPhone: z.string().optional().or(z.literal("")),
    witnessEmail: z.string().email("Invalid email format").optional().or(z.literal(""))
  }),
  "21-4138": z.object({
    veteranName: z.string().min(1, "Veteran's name is required"),
    veteranSSN: z.string().min(1, "Veteran's SSN is required"),
    veteranDateOfBirth: z.string().min(1, "Date of birth is required"),
    veteranAddress: z.string().min(1, "Address is required"),
    veteranPhone: z.string().min(1, "Phone number is required"),
    veteranEmail: z.string().email("Invalid email format").optional().or(z.literal("")),
    statement: z.string().min(1, "Statement is required")
  })
};

export const stepFields = {
  "21-0781": [
    [
      "veteranName",
      "veteranSSN",
      "veteranDateOfBirth",
      "veteranAddress",
      "veteranPhone",
      "veteranEmail"
    ],
    ["branch", "serviceDates"],
    ["traumaticEvents"],
    []
  ],
  "21-10210": [
    [
      "veteranName",
      "veteranSSN",
      "veteranDateOfBirth",
      "veteranAddress",
      "veteranPhone",
      "veteranEmail"
    ],
    ["claimantName", "claimantSSN", "claimantAddress", "claimantPhone", "claimantEmail"],
    ["branch", "serviceDates", "deployments"],
    [
      "disability",
      "relationToService",
      "traumaticEvents",
      "witnessName",
      "witnessRelationship",
      "witnessPhone",
      "witnessEmail"
    ],
    []
  ],
  "21-4138": [
    [
      "veteranName",
      "veteranSSN",
      "veteranDateOfBirth",
      "veteranAddress",
      "veteranPhone",
      "veteranEmail"
    ],
    ["statement"],
    []
  ]
};
