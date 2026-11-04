insert into public.projects
  (id, name, location, description, status, progress, budget, expenses, is_demo)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'Residential Complex - BuildMaster Tower',
    'Mitrovica, Kosovo',
    'Fictional demo construction project.',
    'In Progress',
    64,
    250000,
    142500,
    true
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Commercial Building',
    'Pristina, Kosovo',
    'Fictional demo construction project.',
    'In Progress',
    35,
    180000,
    65000,
    true
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'Road Construction Project',
    'Vushtrri, Kosovo',
    'Fictional demo construction project.',
    'Completed',
    100,
    95000,
    91000,
    true
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'Residential Building',
    'Peja, Kosovo',
    'Fictional demo construction project.',
    'Planned',
    0,
    320000,
    0,
    true
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    'Office Renovation',
    'Mitrovica, Kosovo',
    'Fictional demo construction project.',
    'In Progress',
    72,
    45000,
    31000,
    true
  )
on conflict (id) do nothing;
