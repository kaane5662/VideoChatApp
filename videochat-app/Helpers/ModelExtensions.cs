using System;
using System.Collections.Generic;
using System.Reflection;
using Pinecone;

namespace Helpers {

    public static class ModelExtensions
    {
        public static Pinecone.Metadata ToPineconeMetaData<T>(this T entity)
        {
            var metadata = new Pinecone.Metadata();
            if (entity == null) return metadata;

            foreach (PropertyInfo property in typeof(T).GetProperties())
            {
                
                metadata[property.Name] = (dynamic) (property.GetValue(entity)??"");
            }

            return metadata;
        }
    }
}
