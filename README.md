# SheBond - Pregnancy & Baby Milestone Tracker

SheBond is a comprehensive app for tracking your pregnancy journey and your baby's developmental milestones.

## Features

- **User Authentication**: Secure login and signup with Supabase authentication
- **Pregnancy Tracking**: Keep track of your pregnancy journey week by week
- **Baby Milestones**: Record and celebrate your baby's developmental achievements
- **Dashboard**: Get an overview of your pregnancy and baby's progress
- **Weekly Reports**: Insights and summaries of your pregnancy journey

## Database Structure

The application uses Supabase with the following tables:

- `profiles`: User profile information
- `pregnancy_entries`: Tracking entries for the pregnancy
- `symptoms`: Master list of pregnancy symptoms
- `entry_symptoms`: Junction table for entries and symptoms
- `pregnancy_milestones`: Standard milestones by week
- `moods`: Master list of mood options
- `baby_milestones`: User-recorded baby milestones
- `milestone_categories`: Categories for baby milestones

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Supabase account and project

### Environment Setup

Create a `.env.local` file in the root directory with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

   ```bash
# Install dependencies
npm install
# or
yarn install

# Run the development server
   npm run dev
# or
yarn dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Setup

Run the SQL migrations in the `supabase/migrations` folder to set up your database schema.

## Authentication Flow

1. Users sign up with email/password
2. Upon successful signup, their profile information is stored in the `profiles` table
3. Users can then set their pregnancy start date for personalized tracking
4. Authentication state is maintained across the app

## Usage

### Pregnancy Tracking

1. Set your pregnancy start date in your profile
2. Track your pregnancy week by week
3. Record symptoms, moods, and other pregnancy-related information

### Baby Milestones

1. Navigate to the Baby Milestones page
2. Record when your baby achieves different developmental milestones
3. Add notes and photos to capture special moments
4. Earn medals for completing different milestone categories

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Next.js and Supabase
- Icons provided by Font Awesome via react-icons

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Authentication)
- Chart.js for visualizations

## Project Structure

```
/
├── components/        # React components
│   ├── auth/          # Authentication components
│   ├── layout/        # Layout components
│   ├── pregnancy/     # Pregnancy tracking components
│   └── ui/            # Reusable UI components
├── lib/               # Utility functions and API
├── pages/             # Next.js pages
│   ├── api/           # API routes
│   └── ...            # App pages
├── public/            # Static assets
├── styles/            # CSS styles
└── supabase/          # Supabase schema and migrations
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
