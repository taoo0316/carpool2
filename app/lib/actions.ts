'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import bcrypt from 'bcrypt';
 
const PostSchema = z.object({
  id: z.string(),
  authorId: z.string({
    invalid_type_error: 'Please select an author.',
  }),
  startLocation: z.string({
    invalid_type_error: 'Please select an author.',
  }),
  endLocation: z.string({
    invalid_type_error: 'Please select an author.',
  }),
  status: z.enum(['open', 'closed'], {
    invalid_type_error: 'Please select a post status.',
  }),
  rideService: z.enum(['Grab', 'Gojek', 'Ryde', 'ComfortDelGro', 'TADA'], {
    invalid_type_error: 'Please select a ride service.',
  }),
  rideTime: z.string(),
  postTime: z.string(),
  descrition: z.string(),
  carpoolers: z.string()
});
 
const CreatePost = PostSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    authorId?: string[];
    startLocation?: string[];
    endLocation?: string[];
    status?: string[];
    rideService?: string[];
    rideTime?: string[];
    carpoolers?: string[];
  };
  message?: string | null;
};
 
export async function createPost(prevState: State, formData: FormData) {
    
    // Validate form fields using Zod
    const validatedFields = CreatePost.safeParse({
      authorId: formData.get('customerId'),
      carpoolers: formData.get('carpoolers'),
      status: formData.get('status'),
      startLocation: formData.get('startLocation'),
      endLocation: formData.get('endLocation'),
      rideService: formData.get('rideService'),
      rideTime: formData.get('rideTime'),
      description: formData.get('description')
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Post.',
      };
    }

    // Prepare data for insertion into the database
    const { 
      authorId, 
      carpoolers, 
      status, 
      startLocation, 
      endLocation, 
      rideService, 
      rideTime,
      description } = validatedFields.data;
    const date = new Date().toISOString().split('T')[0];

    // Insert data into the database
    try {
      await sql`
        INSERT INTO posts (author_id, carpoolers, status, start_location, end_location, ride_service, description)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;
    } catch (error) {
      return {
        message: 'Database Error: Failed to Create Invoice.',
      };
    }
  
    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

// Use Zod to update the expected types
const UpdateInvoice = PostSchema.omit({ id: true, date: true });
 
// Update invoice
 
export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
){

  // Validate form fields using Zod
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  // Insert data into the database
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deletePost(id: string) {
  // throw new Error('Failed to Delete Invoice');
  try {
    await sql`DELETE FROM posts WHERE id = ${id}`;
    revalidatePath('/dashboard/posts');
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Post.' };
  }
}

// Log in user
  
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', Object.fromEntries(formData));
  } catch (error) {
    if ((error as Error).message.includes('CredentialsSignin')) {
      return 'CredentialSignin';
    }
    throw error;
  }
}

// Sign user up

const UserSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Please add a name.',
  }),
  email: z.string({
    invalid_type_error: 'Please add an email.',
  }),
  password: z.string({
    invalid_type_error: 'Please add a password.',
  }),
});
 
const CreateUser = UserSchema.omit({ id: true });

export type UserState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};
 
export async function createUser(prevState: UserState, formData: FormData) {
    
    // Validate form fields using Zod
    const validatedUserFields = CreateUser.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedUserFields.success) {
      return {
        errors: validatedUserFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Account.',
      };
    }

    // Prepare data for insertion into the database
    const { name, email, password } = validatedUserFields.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert data into the database
    try {
      await sql`
        INSERT INTO users (name, email, password)
        VALUES (${name}, ${email}, ${hashedPassword})`;
    } catch (error) {
      return {
        message: 'Database Error: Failed to Create Account.',
      };
    }
  
    // Sign in and redirect the user.
    redirect('/');
}