import { getSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import Grid from '@/components/Grid';
import { prisma } from '@/lib/prisma';

const Favorites = ({ homes = [] }) => {
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">Your listings</h1>
      <p className="text-gray-500">
        Manage your homes and update your listings
      </p>
      <div className="mt-8">
        <Grid homes={homes} />
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  
  const homes = await prisma.home.findMany({
    where: {
      favoritedBy: { some: { email: session.user.email } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return {
    props: {
      homes: JSON.parse(JSON.stringify(homes)),
    },
  };
}

export default Favorites;