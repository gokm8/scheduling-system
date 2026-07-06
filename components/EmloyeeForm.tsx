"use client";

export default function EmployeeFormComponent() {
  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const role = formData.get("role");
    console.log(name, email, role);
    console.log(JSON.stringify(Object.fromEntries(formData), null, 2));
  }
  return (
    <>
      <h1>Medarbejderformular</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Navn" name="name" />
        <input type="text" placeholder="E-mail" name="email" />
        <input type="text" placeholder="Rolle" name="role" />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
