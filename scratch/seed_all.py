import json
import os

PROJECT_DIR = r"C:\Users\Rohit\Desktop\wedding-invite-engine"
invites_file = os.path.join(PROJECT_DIR, "data", "invites.json")

with open(invites_file, "r", encoding="utf-8") as f:
    invites = json.load(f)

# Ensure deepak-and-pooja, zayd-and-aaliya, karthik-and-meenakshi are approved
for inv in invites:
    if inv["slug"] in ["deepak-and-pooja", "zayd-and-aaliya", "karthik-and-meenakshi"]:
        inv["status"] = "approved"

# Add demo-shubh-aarambh, demo-nikah-noor, demo-divine-oonjal if not present
missing_demos = [
    {
        "id": "demo_inv_shubh-aarambh",
        "slug": "demo-shubh-aarambh",
        "themeId": "shubh-aarambh",
        "title": "Deepak & Pooja Wedding • Shubh Aarambh",
        "status": "pending_approval",
        "isDemoTemplate": True,
        "couple": {
            "groomName": "Deepak Sharma",
            "groomParents": "Smt. Shanti & Sri Ramesh Sharma",
            "groomFamilyFrom": "Jaipur",
            "brideName": "Pooja Verma",
            "brideParents": "Smt. Sunita & Sri Rajesh Verma",
            "brideFamilyFrom": "Udaipur",
            "heroPhoto": "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
            "ourStory": "From college library smiles to desert sunsets, stepping into forever together.",
            "storyDate": "November 28, 2026"
        },
        "weddingDate": "2026-11-28T18:00:00.000Z",
        "countdownEnabled": True,
        "ceremonies": [
            {
                "id": "c1",
                "title": "Haldi & Welcome Celebrations",
                "date": "November 27, 2026",
                "time": "10:00 AM",
                "venueName": "The Heritage Courtyard",
                "venueAddress": "Jaipur, India",
                "dressCode": "Festive Traditional"
            }
        ],
        "venue": {
            "name": "The Oberoi Rajvilas",
            "address": "Goner Rd, Jaipur, Rajasthan",
            "mapUrl": "https://maps.google.com"
        },
        "rsvp": { "enabled": True, "submissions": [] },
        "blessingsWall": { "enabled": True, "messages": [] },
        "scratchCard": { "enabled": True, "secretMessage": "VIP Secret Pass" },
        "videoUrl": "/videos/deepak-and-pooja.mp4"
    },
    {
        "id": "demo_inv_nikah-noor",
        "slug": "demo-nikah-noor",
        "themeId": "nikah-noor",
        "title": "Zayd & Aaliya Wedding • Nikah Noor",
        "status": "pending_approval",
        "isDemoTemplate": True,
        "couple": {
            "groomName": "Zayd Siddiqui",
            "groomParents": "Begum Fatima & Janab Farooq Siddiqui",
            "groomFamilyFrom": "Hyderabad",
            "brideName": "Aaliya Khan",
            "brideParents": "Begum Nasreen & Janab Tariq Khan",
            "brideFamilyFrom": "Lucknow",
            "heroPhoto": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
            "ourStory": "Written in the stars and bound by eternal respect and cherished devotion.",
            "storyDate": "December 12, 2026"
        },
        "weddingDate": "2026-12-12T19:30:00.000Z",
        "countdownEnabled": True,
        "ceremonies": [
            {
                "id": "c1",
                "title": "Nikah Ceremony",
                "date": "December 12, 2026",
                "time": "07:30 PM",
                "venueName": "Grand Dining Hall, Taj Falaknuma",
                "venueAddress": "Hyderabad, India",
                "dressCode": "Royal Nizami"
            }
        ],
        "venue": {
            "name": "Taj Falaknuma Palace",
            "address": "Hyderabad, Telangana",
            "mapUrl": "https://maps.google.com"
        },
        "rsvp": { "enabled": True, "submissions": [] },
        "blessingsWall": { "enabled": True, "messages": [] },
        "scratchCard": { "enabled": True, "secretMessage": "VIP Secret Pass" },
        "videoUrl": "/videos/zayd-and-aaliya.mp4"
    },
    {
        "id": "demo_inv_divine-oonjal",
        "slug": "demo-divine-oonjal",
        "themeId": "divine-oonjal",
        "title": "Karthik & Meenakshi Wedding • Divine Oonjal",
        "status": "pending_approval",
        "isDemoTemplate": True,
        "couple": {
            "groomName": "Karthik Sundaram",
            "groomParents": "Smt. Kalyani & Sri Sundaram Iyer",
            "groomFamilyFrom": "Chennai",
            "brideName": "Meenakshi Ramanathan",
            "brideParents": "Smt. Vidya & Sri Ramanathan Chettiar",
            "brideFamilyFrom": "Madurai",
            "heroPhoto": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
            "ourStory": "Two classical music aficionados uniting their journeys in sacred harmony.",
            "storyDate": "January 18, 2027"
        },
        "weddingDate": "2027-01-18T06:30:00.000Z",
        "countdownEnabled": True,
        "ceremonies": [
            {
                "id": "c1",
                "title": "Muhurtham & Mangalya Dharanam",
                "date": "January 18, 2027",
                "time": "06:30 AM",
                "venueName": "Sri Krishna Gana Sabha",
                "venueAddress": "Chennai, India",
                "dressCode": "Traditional Kanjivaram Silk"
            }
        ],
        "venue": {
            "name": "Sri Krishna Gana Sabha Mandapam",
            "address": "Chennai, Tamil Nadu",
            "mapUrl": "https://maps.google.com"
        },
        "rsvp": { "enabled": True, "submissions": [] },
        "blessingsWall": { "enabled": True, "messages": [] },
        "scratchCard": { "enabled": True, "secretMessage": "VIP Secret Pass" },
        "videoUrl": "/videos/karthik-and-meenakshi.mp4"
    }
]

for d in missing_demos:
    if not any(i["slug"] == d["slug"] for i in invites):
        invites.append(d)

with open(invites_file, "w", encoding="utf-8") as f:
    json.dump(invites, f, indent=2)

print(f"Total invites in DB now: {len(invites)}")
