import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

interface ThunkLogCardProps {
  isVisible: boolean;
}

const ThunkLogCard = ({ isVisible }: ThunkLogCardProps) => {
  return (
    <motion.div
      className="box has-background-white-ter py-5 px-6"
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      exit="hidden"
      style={{ opacity: 0.9, maxWidth: '300px', margin: '1rem auto' }}
    >
      <h3 className="title is-4 has-text-grey-dark">Thunk Log</h3>
      <p className="subtitle is-6 has-text-grey-dark"></p>
      <button className="button is-info is-fullwidth mt-4">View</button>
    </motion.div>
  );
};

export default ThunkLogCard;