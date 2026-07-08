CREATE TABLE organization (
	organization_id SERIAL PRIMARY KEY,
	name VARCHAR(150) NOT NULL,
	description TEXT NOT NULL,
	contact_email VARCHAR(250) NOT NULL,
	logo_filename VARCHAR(250) NOT NULL
)

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES 
    (
        'BrightFuture Builders', 
        'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 
        'info@brightfuturebuilders.org', 
        'brightfuture-logo.png'
    ),
    (
        'GreenHarvest Growers', 
        'An urban farming collective promoting food sustainability and education in local neighborhoods.', 
        'contact@greenharvest.org', 
        'greenharvest-logo.png'
    ),
    (
        'UnityServe Volunteers', 
        'A volunteer coordination group supporting local charities and service initiatives.', 
        'hello@unityserve.org', 
        'unityserve-logo.png'
    );

create table project (
project_id SERIAL PRIMARY KEY,
organization_id INT References organization(organization_id) NOT NULL,
title VARCHAR(150) NOT NULL,
description TEXT NOT NULL,
location TEXT NOT NULL,
date DATE NOT NULL
)

INSERT INTO project (organization_id, title, description, location, date)
VALUES 
    -- Organization 1: BrightFuture Builders (IDs 1-5)
    (1, 'Community Center Ramp Build', 'Constructing wheelchair-accessible ramps at the downtown youth community center.', '123 Main St, Lubbock, TX', '2026-08-15'),
    (1, 'Eco-Friendly Roofing Seminar', 'A hands-on workshop teaching residents how to install energy-efficient metal roofing.', '456 Oak Ave, Lubbock, TX', '2026-09-10'),
    (1, 'Park Bench Restoration', 'Repairing and repainting weathered benches using recycled composite lumber across city parks.', 'Maxey Park, Lubbock, TX', '2026-10-05'),
    (1, 'Affordable Housing Framing', 'Assisting with the structural wood framing phase of a new multi-family affordable housing complex.', '789 Pine Rd, Lubbock, TX', '2026-11-12'),
    (1, 'Sustainable Insulation Install', 'Upgrading insulation in older community homes using eco-friendly cellulose materials to reduce heating bills.', '101 Elm St, Lubbock, TX', '2026-12-01'),

    -- Organization 2: GreenHarvest Growers (IDs 6-10)
    (2, 'Spring Seedling Planting', 'Prepping the soil and planting the initial heirloom tomato and pepper seeds for the season.', 'Northside Community Garden, Lubbock, TX', '2026-04-20'),
    (2, 'Urban Irrigation Setup', 'Installing an automated drip irrigation system to conserve water in our neighborhood greenhouse.', 'Eastside Green Hub, Lubbock, TX', '2026-05-18'),
    (2, 'Composting 101 Workshop', 'An educational session for neighbors on how to successfully compost food waste at home.', '202 Marsha Sharp Fwy, Lubbock, TX', '2026-06-14'),
    (2, 'Downtown Farmers Market Prep', 'Harvesting, washing, and packaging organic leafy greens for the weekend community market.', 'Depot District Market, Lubbock, TX', '2026-07-25'),
    (2, 'School Orchard Planting', 'Planting fruit-bearing trees at local elementary schools to teach kids about agriculture.', 'Lubbock ISD Elementary, Lubbock, TX', '2026-09-22'),

    -- Organization 3: UnityServe Volunteers (IDs 11-15)
    (3, 'Annual Food Drive Sorting', 'Categorizing and boxing non-perishable food items donated during the city-wide summer drive.', 'South Plains Food Bank, Lubbock, TX', '2026-06-05'),
    (3, 'Senior Center Technology Class', 'One-on-one volunteering to help elderly residents learn how to navigate tablets and video call family.', 'Golden Age Home, Lubbock, TX', '2026-07-19'),
    (3, 'Back-to-School Backpack Drive', 'Stuffing backpacks with essential school supplies for underprivileged local children.', 'Civic Center Exhibit Hall, Lubbock, TX', '2026-08-08'),
    (3, 'Animal Shelter Blanket Making', 'Gathering volunteers to cut and tie fleece blankets for local rescue dogs and cats.', 'Lubbock Animal Shelter, Lubbock, TX', '2026-10-17'),
    (3, 'Holiday Toy Drive Wrap Event', 'Checking, sorting, and gift-wrapping holiday toys for families in need.', 'Unity Hall Room B, Lubbock, TX', '2026-12-10');



SELECT 
project.project_id,
project.organization_id,
project.title,
project.description,
project.location,
project.date,
organization.name

FROM project
JOIN organization ON organization.organization_id = project.organization_id;