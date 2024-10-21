const Footer = () => {
  return (
    <footer className="mt-20 flex items-center justify-center border-t py-10 border-neutral-700">
      <div>
        &copy; {new Date().getFullYear()} Copyright:{' '}
        <a className='text-dark' href='https://www.linkedin.com/in/rohit-kandpal-/'>
          RohitKandpal
        </a>
      </div>
    </footer>
  );
};

export default Footer;
