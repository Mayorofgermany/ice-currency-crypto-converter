import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting IgamaZi database seed...");

  // Clear existing records
  await prisma.auditLog.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.report.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.verificationRequest.deleteMany();
  await prisma.publicLink.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.education.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.profilePrivacy.deleteMany();
  await prisma.session.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const defaultPasswordHash = await bcrypt.hash("Password123!", 10);

  // 1. Create Super Admin / Admin
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@igamazi.com",
      passwordHash: defaultPasswordHash,
      fullName: "Dr. Babatunde Lawal",
      country: "Nigeria",
      role: "ADMIN",
      status: "ACTIVE",
      emailVerified: true,
      profile: {
        create: {
          displayName: "Dr. Babatunde Lawal",
          headline: "Director of Trust, Identity & Verification at IgamaZi",
          bio: "Cybersecurity governance expert and digital identity researcher with 18+ years of public and private sector advisory experience in West Africa.",
          profession: "Cybersecurity & Identity Architect",
          organization: "IgamaZi Security & Trust Lab",
          industry: "Information Security",
          city: "Abuja",
          country: "Nigeria",
          phone: "+234 803 111 2233",
          email: "babatunde.lawal@igamazi.com",
          profilePhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
          isSearchable: true,
          completionScore: 100,
          privacy: {
            create: {
              overallVisibility: "PUBLIC",
              emailVisibility: "REGISTERED_ONLY",
              phoneVisibility: "PRIVATE",
              locationVisibility: "CITY_ONLY",
              experienceVisibility: "PUBLIC",
              educationVisibility: "PUBLIC",
              skillsVisibility: "PUBLIC",
              linksVisibility: "PUBLIC",
              allowContactForm: true,
            },
          },
          verifications: {
            create: [
              {
                type: "IDENTITY",
                badgeLabel: "National ID Verified",
              },
              {
                type: "ORGANIZATION",
                badgeLabel: "Verified Authority",
              },
            ],
          },
          experiences: {
            create: [
              {
                title: "Chief Trust & Compliance Officer",
                company: "IgamaZi Trust Network",
                industry: "Information Security",
                startDate: "2023",
                isCurrent: true,
                description: "Overseeing data privacy compliance (NDPR/GDPR), anti-fraud intelligence, and verification standards.",
              },
              {
                title: "Senior Security Advisory Consultant",
                company: "CyberSecure Africa",
                industry: "Technology",
                startDate: "2018",
                endDate: "2023",
                isCurrent: false,
                description: "Advised enterprise financial institutions and telecommunications providers on identity architecture.",
              },
            ],
          },
          educations: {
            create: [
              {
                institution: "University of Lagos",
                degree: "Ph.D. in Computer Science (Cryptography & Networks)",
                fieldOfStudy: "Computer Science",
                startYear: 2012,
                endYear: 2016,
              },
              {
                institution: "Ahmadu Bello University",
                degree: "B.Sc. Computer Engineering (First Class Honours)",
                fieldOfStudy: "Engineering",
                startYear: 2004,
                endYear: 2009,
              },
            ],
          },
          skills: {
            create: [
              { name: "Digital Identity Architecture", category: "Technology" },
              { name: "NDPR / GDPR Compliance", category: "Legal & Regulatory" },
              { name: "Cryptographic Protocols", category: "Security" },
              { name: "Enterprise Risk Assessment", category: "Management" },
            ],
          },
          publicLinks: {
            create: [
              { platform: "LinkedIn", url: "https://linkedin.com/in/babatunde-lawal" },
              { platform: "Website", url: "https://babatundelawal.org" },
            ],
          },
        },
      },
    },
  });

  // 2. Demo User 1: Dr. Amina Bello (Cardiothoracic Surgeon)
  const aminaUser = await prisma.user.create({
    data: {
      email: "amina.bello@lagosmed.ng",
      passwordHash: defaultPasswordHash,
      fullName: "Dr. Amina Aisha Bello",
      country: "Nigeria",
      role: "USER",
      status: "ACTIVE",
      emailVerified: true,
      profile: {
        create: {
          displayName: "Dr. Amina Aisha Bello",
          headline: "Consultant Cardiothoracic Surgeon | Clinical Lead at Lagos Heart Institute",
          bio: "Specializing in minimally invasive cardiac surgery, congenital heart repair, and maternal cardiac healthcare advocacy across Sub-Saharan Africa.",
          profession: "Cardiothoracic Surgeon",
          organization: "Lagos Heart & Vascular Institute",
          industry: "Healthcare & Medicine",
          city: "Lagos",
          country: "Nigeria",
          phone: "+234 802 334 5566",
          email: "a.bello@lagosheart.org",
          profilePhotoUrl: "https://images.unsplash.com/photo-1594824813580-c112e4ebc518?auto=format&fit=crop&w=400&q=80",
          isSearchable: true,
          completionScore: 95,
          privacy: {
            create: {
              overallVisibility: "PUBLIC",
              emailVisibility: "REGISTERED_ONLY",
              phoneVisibility: "PRIVATE",
              locationVisibility: "CITY_ONLY",
              experienceVisibility: "PUBLIC",
              educationVisibility: "PUBLIC",
              skillsVisibility: "PUBLIC",
              linksVisibility: "PUBLIC",
              allowContactForm: true,
            },
          },
          verifications: {
            create: [
              {
                type: "IDENTITY",
                badgeLabel: "Govt ID Verified",
              },
              {
                type: "PROFESSION",
                badgeLabel: "Medical & Dental Council of Nigeria Verified",
              },
            ],
          },
          experiences: {
            create: [
              {
                title: "Head of Surgical Services",
                company: "Lagos Heart & Vascular Institute",
                industry: "Healthcare",
                startDate: "2019",
                isCurrent: true,
                description: "Leading a department of 14 surgical residents and specialists performing 200+ procedures annually.",
              },
            ],
          },
          educations: {
            create: [
              {
                institution: "University of Ibadan College of Medicine",
                degree: "MBBS (Distinction in Surgery)",
                fieldOfStudy: "Medicine",
                startYear: 2005,
                endYear: 2011,
              },
              {
                institution: "West African College of Surgeons",
                degree: "FWACS (Fellowship in Cardiothoracic Surgery)",
                fieldOfStudy: "Surgery",
                startYear: 2013,
                endYear: 2018,
              },
            ],
          },
          skills: {
            create: [
              { name: "Minimally Invasive Cardiac Surgery", category: "Medical" },
              { name: "Aortic Root Reconstruction", category: "Medical" },
              { name: "Clinical Research", category: "Research" },
            ],
          },
          publicLinks: {
            create: [
              { platform: "LinkedIn", url: "https://linkedin.com/in/draminabello" },
              { platform: "Website", url: "https://lagosheart.org/surgeons/dr-amina-bello" },
            ],
          },
        },
      },
    },
  });

  // 3. Demo User 2: Chidi Okafor (Fintech Founder & CTO)
  const chidiUser = await prisma.user.create({
    data: {
      email: "chidi@paynexus.io",
      passwordHash: defaultPasswordHash,
      fullName: "Chidi Anthony Okafor",
      country: "Nigeria",
      role: "USER",
      status: "ACTIVE",
      emailVerified: true,
      profile: {
        create: {
          displayName: "Chidi Anthony Okafor",
          headline: "Co-Founder & CTO at PayNexus | Ex-Stripe | Y Combinator Alum",
          bio: "Building cross-border liquidity rails for African digital businesses. Passionate about distributed systems, resilient payment gateways, and mentoring early-career engineers.",
          profession: "Fintech CTO & Software Architect",
          organization: "PayNexus Financial Technologies",
          industry: "Financial Technology",
          city: "Lagos",
          country: "Nigeria",
          phone: "+234 810 555 7788",
          email: "chidi@paynexus.io",
          profilePhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
          isSearchable: true,
          completionScore: 90,
          privacy: {
            create: {
              overallVisibility: "PUBLIC",
              emailVisibility: "PUBLIC",
              phoneVisibility: "PRIVATE",
              locationVisibility: "CITY_ONLY",
              experienceVisibility: "PUBLIC",
              educationVisibility: "PUBLIC",
              skillsVisibility: "PUBLIC",
              linksVisibility: "PUBLIC",
              allowContactForm: true,
            },
          },
          verifications: {
            create: [
              {
                type: "IDENTITY",
                badgeLabel: "Verified Identity",
              },
              {
                type: "ORGANIZATION",
                badgeLabel: "Verified Corporate Executive",
              },
            ],
          },
          experiences: {
            create: [
              {
                title: "Chief Technology Officer & Co-Founder",
                company: "PayNexus",
                industry: "Financial Technology",
                startDate: "2021",
                isCurrent: true,
                description: "Built the core payment gateway processing over $40M monthly across 6 African markets.",
              },
              {
                title: "Staff Software Engineer",
                company: "Stripe",
                industry: "Fintech",
                startDate: "2017",
                endDate: "2021",
                isCurrent: false,
                description: "Architected high-throughput ledger services with 99.999% availability.",
              },
            ],
          },
          educations: {
            create: [
              {
                institution: "Obafemi Awolowo University (OAU)",
                degree: "B.Sc. Electronic & Electrical Engineering",
                fieldOfStudy: "Engineering",
                startYear: 2011,
                endYear: 2016,
              },
            ],
          },
          skills: {
            create: [
              { name: "Distributed Ledger Architecture", category: "Technology" },
              { name: "High-Volume Transaction Processing", category: "Fintech" },
              { name: "TypeScript / Go / Rust", category: "Engineering" },
            ],
          },
          publicLinks: {
            create: [
              { platform: "GitHub", url: "https://github.com/chidiokafor" },
              { platform: "LinkedIn", url: "https://linkedin.com/in/chidiokafor-tech" },
              { platform: "Twitter", url: "https://x.com/chidi_codes" },
            ],
          },
        },
      },
    },
  });

  // 4. Demo User 3: Folashade Adeyemi, SAN (Senior Advocate of Nigeria)
  const folaUser = await prisma.user.create({
    data: {
      email: "folashade@adeyemipartners.law",
      passwordHash: defaultPasswordHash,
      fullName: "Folashade Adeyemi, SAN",
      country: "Nigeria",
      role: "USER",
      status: "ACTIVE",
      emailVerified: true,
      profile: {
        create: {
          displayName: "Folashade Adeyemi, SAN",
          headline: "Managing Partner at Adeyemi & Partners Law Chambers | Arbitrator",
          bio: "Senior Advocate of Nigeria with 22 years of trial experience in commercial dispute resolution, intellectual property rights, and constitutional law.",
          profession: "Senior Advocate of Nigeria (SAN) & Arbitrator",
          organization: "Adeyemi & Partners Law Chambers",
          industry: "Legal Services",
          city: "Abuja",
          country: "Nigeria",
          phone: "+234 809 112 3344",
          email: "contact@adeyemipartners.law",
          profilePhotoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
          isSearchable: true,
          completionScore: 100,
          privacy: {
            create: {
              overallVisibility: "PUBLIC",
              emailVisibility: "PUBLIC",
              phoneVisibility: "PRIVATE",
              locationVisibility: "CITY_ONLY",
              experienceVisibility: "PUBLIC",
              educationVisibility: "PUBLIC",
              skillsVisibility: "PUBLIC",
              linksVisibility: "PUBLIC",
              allowContactForm: true,
            },
          },
          verifications: {
            create: [
              {
                type: "IDENTITY",
                badgeLabel: "Identity Verified",
              },
              {
                type: "PROFESSION",
                badgeLabel: "Senior Advocate of Nigeria (SAN) Confirmed",
              },
            ],
          },
          experiences: {
            create: [
              {
                title: "Managing Partner",
                company: "Adeyemi & Partners",
                industry: "Legal Services",
                startDate: "2006",
                isCurrent: true,
                description: "Heading litigation and corporate advisory practice with 30+ associate attorneys.",
              },
            ],
          },
          educations: {
            create: [
              {
                institution: "Nigerian Law School",
                degree: "B.L (Honours)",
                fieldOfStudy: "Law",
                startYear: 2001,
                endYear: 2002,
              },
              {
                institution: "University of Cambridge",
                degree: "Master of Laws (LL.M)",
                fieldOfStudy: "International Commercial Law",
                startYear: 2003,
                endYear: 2004,
              },
            ],
          },
          skills: {
            create: [
              { name: "Commercial Litigation", category: "Legal" },
              { name: "Cross-Border Arbitration", category: "Dispute Resolution" },
              { name: "Regulatory Compliance", category: "Governance" },
            ],
          },
          publicLinks: {
            create: [
              { platform: "LinkedIn", url: "https://linkedin.com/in/folashadeadeyemi-san" },
              { platform: "Website", url: "https://adeyemipartners.law" },
            ],
          },
        },
      },
    },
  });

  // 5. Demo User 4: Emeka Obi (Pending Verification Request)
  const emekaUser = await prisma.user.create({
    data: {
      email: "emeka.obi@buildcon.ng",
      passwordHash: defaultPasswordHash,
      fullName: "Emeka Christian Obi",
      country: "Nigeria",
      role: "USER",
      status: "ACTIVE",
      emailVerified: true,
      profile: {
        create: {
          displayName: "Emeka Christian Obi",
          headline: "Principal Structural Engineer | Lead Architect at EcoBuild Consortium",
          bio: "Registered engineer with 12+ years designing climate-resilient commercial complexes, highway bridges, and sustainable mixed-use high-rises.",
          profession: "Chartered Structural Engineer",
          organization: "EcoBuild Design & Construction Consortium",
          industry: "Architecture & Civil Engineering",
          city: "Port Harcourt",
          country: "Nigeria",
          phone: "+234 812 999 4433",
          email: "emeka@ecobuild.ng",
          profilePhotoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
          isSearchable: true,
          completionScore: 85,
          privacy: {
            create: {
              overallVisibility: "PUBLIC",
              emailVisibility: "REGISTERED_ONLY",
              phoneVisibility: "PRIVATE",
              locationVisibility: "CITY_ONLY",
              experienceVisibility: "PUBLIC",
              educationVisibility: "PUBLIC",
              skillsVisibility: "PUBLIC",
              linksVisibility: "PUBLIC",
              allowContactForm: true,
            },
          },
          verifications: {
            create: [
              {
                type: "IDENTITY",
                badgeLabel: "Identity Verified",
              },
            ],
          },
          experiences: {
            create: [
              {
                title: "Principal Engineer",
                company: "EcoBuild Consortium",
                industry: "Engineering",
                startDate: "2015",
                isCurrent: true,
                description: "Supervising structural integrity audits and BIM modeling for municipal infrastructure projects.",
              },
            ],
          },
          educations: {
            create: [
              {
                institution: "University of Nigeria, Nsukka (UNN)",
                degree: "B.Eng. Civil Engineering",
                fieldOfStudy: "Civil Engineering",
                startYear: 2007,
                endYear: 2012,
              },
            ],
          },
          skills: {
            create: [
              { name: "Structural Integrity Analysis", category: "Engineering" },
              { name: "BIM & CAD Modeling", category: "Design" },
              { name: "COREN Certification", category: "Licensing" },
            ],
          },
          publicLinks: {
            create: [
              { platform: "LinkedIn", url: "https://linkedin.com/in/emeka-obi-engineer" },
            ],
          },
        },
      },
    },
  });

  // Get Emeka's profile ID to add a pending verification request
  const emekaProfile = await prisma.profile.findUnique({
    where: { userId: emekaUser.id },
  });

  if (emekaProfile) {
    await prisma.verificationRequest.create({
      data: {
        profileId: emekaProfile.id,
        userId: emekaUser.id,
        type: "PROFESSION",
        status: "PENDING",
        evidenceText: "COREN License Number R.38291/COREN/2016. Letter of Good Standing from Nigerian Society of Engineers.",
        documentUrl: "https://example.com/docs/coren_license_emeka_obi.pdf",
        adminNotes: "Awaiting verification from COREN registry portal.",
      },
    });

    // Sample contact message sent to Emeka
    await prisma.contactMessage.create({
      data: {
        recipientProfileId: emekaProfile.id,
        senderName: "Tariere Allison",
        senderEmail: "tariere.allison@delta-estates.com",
        subject: "Consultancy Inquiry: 14-Story Commercial Tower Foundation",
        message: "Dear Engr. Obi, We reviewed your public credentials on IgamaZi and would like to invite you for a proposal on our upcoming Port Harcourt maritime tower project. Please let us know if you are open for a discovery call.",
        isRead: false,
      },
    });
  }

  // Peer Recommendations
  const adminProfile = await prisma.profile.findUnique({ where: { userId: adminUser.id } });
  const aminaProfile = await prisma.profile.findUnique({ where: { userId: aminaUser.id } });
  const chidiProfile = await prisma.profile.findUnique({ where: { userId: chidiUser.id } });
  const folashadeProfile = await prisma.profile.findUnique({ where: { userId: folaUser.id } });

  if (aminaProfile && adminProfile && chidiProfile && folashadeProfile && emekaProfile) {
    // 1. Dr. Babatunde Lawal endorses Dr. Amina Aisha Bello
    await prisma.recommendation.create({
      data: {
        recipientProfileId: aminaProfile.id,
        authorProfileId: adminProfile.id,
        relationship: "Professional Peer & Healthcare Governance Colleague",
        content: "Dr. Amina Bello represents the highest caliber of medical ethics, clinical mastery, and patient care in pediatric cardiothoracic surgery. Having collaborated with her on emergency surgical protocols, her commitment to patient well-being and clinical integrity is unassailable.",
        status: "APPROVED",
      },
    });

    // 2. Folashade Adeyemi SAN endorses Dr. Amina Aisha Bello
    await prisma.recommendation.create({
      data: {
        recipientProfileId: aminaProfile.id,
        authorProfileId: folashadeProfile.id,
        relationship: "Advised Directly on Healthcare Regulatory Matters",
        content: "Dr. Bello provides insightful, rigorous, and unimpeachable clinical opinions. Her leadership at the Lagos Heart & Vascular Institute demonstrates exemplary professional accountability and dedication.",
        status: "APPROVED",
      },
    });

    // 3. Dr. Amina Aisha Bello endorses Chidi Okafor
    await prisma.recommendation.create({
      data: {
        recipientProfileId: chidiProfile.id,
        authorProfileId: aminaProfile.id,
        relationship: "Collaborated on Health-Fintech Infrastructure",
        content: "Chidi and his engineering team at PayNexus architected secure, HIPAA/NDPR-compliant payment gateways that reduced patient admission wait times by over 60%. His dedication to data security and seamless engineering is exceptional.",
        status: "APPROVED",
      },
    });

    // 4. Engr. Emeka Obi endorses Folashade Adeyemi SAN
    await prisma.recommendation.create({
      data: {
        recipientProfileId: folashadeProfile.id,
        authorProfileId: emekaProfile.id,
        relationship: "Retained Legal Counsel on Major Civil Works",
        content: "Mrs. Adeyemi is an unmatched legal powerhouse in corporate infrastructure contracts and cross-border arbitration. Her counsel protected our engineering consortium through multi-million dollar public-private partnerships.",
        status: "APPROVED",
      },
    });

    // 5. Chidi Okafor endorses Dr. Babatunde Lawal
    await prisma.recommendation.create({
      data: {
        recipientProfileId: adminProfile.id,
        authorProfileId: chidiProfile.id,
        relationship: "Cybersecurity & Identity Governance Advisor",
        content: "Dr. Lawal has guided fintech startups across Africa through complex identity compliance landscapes. His knowledge of NDPR, zero-trust frameworks, and cybersecurity is premier.",
        status: "APPROVED",
      },
    });
  }

  if (chidiProfile) {
    await prisma.report.create({
      data: {
        reportedProfileId: chidiProfile.id,
        reporterUserId: aminaUser.id,
        category: "INCORRECT_INFO",
        details: "There was a typo in the previous press release regarding company office address in Victoria Island. Just requesting verification that physical office address is accurate.",
        status: "PENDING",
        actionTaken: null,
      },
    });
  }

  // Initial audit log
  await prisma.auditLog.create({
    data: {
      actorUserId: adminUser.id,
      action: "SYSTEM_INITIALIZE",
      entityType: "SYSTEM",
      entityId: "ROOT",
      ipAddress: "127.0.0.1",
      detailsJson: JSON.stringify({ message: "IgamaZi directory database initialized and demo registry seeded" }),
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log("Admin account: admin@igamazi.com / Password123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
